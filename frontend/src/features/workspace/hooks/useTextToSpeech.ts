import { useState, useEffect, useCallback } from 'react';
import { speechService, type SpeechState } from '../services/speechService';

export interface UseMessageSpeechReturn {
  isPlaying: boolean;
  toggleSpeech: () => void;
  stopSpeech: () => void;
}

/**
 * Custom React hook subscribing to global speech state for a specific message ID.
 */
export function useMessageSpeech(messageId: string, content: string): UseMessageSpeechReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    return speechService.getActiveMessageId() === messageId && speechService.getIsSpeaking();
  });

  useEffect(() => {
    const handleStateChange = (state: SpeechState) => {
      setIsPlaying(state.activeMessageId === messageId && state.isSpeaking);
    };

    const unsubscribe = speechService.subscribe(handleStateChange);
    return unsubscribe;
  }, [messageId]);

  const toggleSpeech = useCallback(() => {
    speechService.speak(messageId, content);
  }, [messageId, content]);

  const stopSpeech = useCallback(() => {
    speechService.stop();
  }, []);

  return { isPlaying, toggleSpeech, stopSpeech };
}
