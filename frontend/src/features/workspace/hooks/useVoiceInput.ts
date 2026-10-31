import { useState, useRef, useEffect, useCallback } from 'react';
import { transcribeAudio } from '../services/voiceApi';

export interface UseVoiceInputOptions {
  onTranscriptionSuccess: (transcription: string) => void;
  onError?: (errorMessage: string) => void;
}

export interface UseVoiceInputReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  recordingDuration: number;
  audioLevels: number[];
  errorMessage: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => void;
  clearError: () => void;
}

const DEFAULT_BAR_COUNT = 28;

/**
 * Dynamically resolves the best audio recording MIME type supported by the current browser.
 */
function getBestSupportedMimeType(): string {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return 'audio/webm';
  }
  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
    'audio/wav',
  ];
  for (const candidate of candidateTypes) {
    if (MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }
  return '';
}

/**
 * Custom React hook managing browser microphone recording, live audio level analysis,
 * and Gemini transcription dispatch.
 */
export const useVoiceInput = ({
  onTranscriptionSuccess,
  onError,
}: UseVoiceInputOptions): UseVoiceInputReturn => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(
    () => new Array(DEFAULT_BAR_COUNT).fill(0.12)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const durationTimerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isCancelledRef = useRef<boolean>(false);
  const recordingMimeTypeRef = useRef<string>('audio/webm');

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  /**
   * Complete teardown of all active media streams, contexts, and timers.
   */
  const cleanupMediaResources = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (durationTimerRef.current !== null) {
      window.clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setAudioLevels(new Array(DEFAULT_BAR_COUNT).fill(0.12));
  }, []);

  // Ensure teardown on unmount
  useEffect(() => {
    return () => {
      cleanupMediaResources();
    };
  }, [cleanupMediaResources]);

  /**
   * Continuous loop reading AnalyserNode frequency bins for responsive waveform animation.
   */
  const startAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount; // 32 bins
      const dataArray = new Uint8Array(bufferLength);

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Map first 28 bins to smooth height multipliers (0.12 min to 1.0 max)
        const levels = [];
        for (let i = 0; i < DEFAULT_BAR_COUNT; i++) {
          const binIndex = Math.min(i, bufferLength - 1);
          const rawVal = dataArray[binIndex] / 255;
          // Apply slight curve and minimum resting height
          const normalized = Math.max(0.12, Math.min(1.0, rawVal * 1.35));
          levels.push(normalized);
        }
        setAudioLevels(levels);

        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };

      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    } catch (e) {
      console.warn('Web Audio API analyser initialization error:', e);
    }
  }, []);

  /**
   * Requests microphone access and begins recording.
   */
  const startRecording = useCallback(async () => {
    clearError();
    isCancelledRef.current = false;
    chunksRef.current = [];

    if (!navigator?.mediaDevices?.getUserMedia) {
      const err = 'Your browser does not support audio recording (MediaDevices API unavailable).';
      setErrorMessage(err);
      onError?.(err);
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err: unknown) {
      let friendlyError = 'Microphone access was denied or is unavailable.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          friendlyError = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          friendlyError = 'No microphone device was detected on your system.';
        } else if (err.name === 'NotReadableError') {
          friendlyError = 'Microphone is currently in use by another application.';
        }
      }
      setErrorMessage(friendlyError);
      onError?.(friendlyError);
      return;
    }

    try {
      const mimeType = getBestSupportedMimeType();
      recordingMimeTypeRef.current = mimeType || 'audio/webm';

      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        const msg = 'Microphone recording encountered an error.';
        setErrorMessage(msg);
        onError?.(msg);
        cleanupMediaResources();
        setIsRecording(false);
      };

      recorder.onstop = async () => {
        // If recording was cancelled, discard captured audio
        if (isCancelledRef.current) {
          cleanupMediaResources();
          setIsRecording(false);
          setIsTranscribing(false);
          return;
        }

        const audioBlob = new Blob(chunksRef.current, {
          type: recordingMimeTypeRef.current,
        });

        cleanupMediaResources();
        setIsRecording(false);

        if (audioBlob.size === 0) {
          const emptyMsg = 'No audio data was captured.';
          setErrorMessage(emptyMsg);
          onError?.(emptyMsg);
          return;
        }

        setIsTranscribing(true);

        try {
          const transcription = await transcribeAudio(audioBlob, recordingMimeTypeRef.current);
          setIsTranscribing(false);

          if (!transcription || !transcription.trim()) {
            const noSpeechMsg = 'No speech detected. Please try speaking again.';
            setErrorMessage(noSpeechMsg);
            onError?.(noSpeechMsg);
            return;
          }

          onTranscriptionSuccess(transcription.trim());
        } catch (transcribeErr: unknown) {
          setIsTranscribing(false);
          const errDetail =
            transcribeErr instanceof Error
              ? transcribeErr.message
              : 'Voice transcription failed. Please try again.';
          setErrorMessage(errDetail);
          onError?.(errDetail);
        }
      };

      // Request time slices every 250ms for reliable chunks collection
      recorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration counter
      durationTimerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Connect audio analyser for responsive waveform
      startAudioAnalysis(stream);
    } catch (err: unknown) {
      cleanupMediaResources();
      setIsRecording(false);
      const initErr = err instanceof Error ? err.message : 'Failed to initialize audio recorder.';
      setErrorMessage(initErr);
      onError?.(initErr);
    }
  }, [clearError, cleanupMediaResources, onError, onTranscriptionSuccess, startAudioAnalysis]);

  /**
   * Finalizes recording and initiates transcription.
   */
  const stopRecording = useCallback(async () => {
    isCancelledRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        cleanupMediaResources();
        setIsRecording(false);
      }
    } else {
      cleanupMediaResources();
      setIsRecording(false);
    }
  }, [cleanupMediaResources]);

  /**
   * Cancels current recording immediately without sending or transcribing audio.
   */
  const cancelRecording = useCallback(() => {
    isCancelledRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    cleanupMediaResources();
    setIsRecording(false);
    setIsTranscribing(false);
    setRecordingDuration(0);
    clearError();
  }, [cleanupMediaResources, clearError]);

  return {
    isRecording,
    isTranscribing,
    recordingDuration,
    audioLevels,
    errorMessage,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError,
  };
};
