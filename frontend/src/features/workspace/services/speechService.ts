/**
 * Text-to-Speech (Read Aloud) Service for LexAI India.
 * Utilizes the browser's built-in Web Speech API (window.speechSynthesis).
 * 
 * Features:
 * - Markdown cleaner that strips formatting artifacts (asterisks, hashes, brackets)
 *   while preserving natural pauses between headings, paragraphs, and list items.
 * - Sentence-level chunking to prevent browser speech cutoffs on long legal responses.
 * - Centralized singleton state ensuring only one message speaks at a time.
 * - Graceful fallback and error handling without external API dependencies.
 */

export interface SpeechState {
  activeMessageId: string | null;
  isSpeaking: boolean;
}

type SpeechListener = (state: SpeechState) => void;

/**
 * Cleans markdown formatting for natural voice synthesis.
 */
export function cleanMarkdownForSpeech(markdown: string): string {
  if (!markdown) return '';

  // 1. Normalize line breaks
  let text = markdown.replace(/\r\n/g, '\n');

  // 2. Remove code blocks and inline code
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');

  // 3. Remove blockquotes
  text = text.replace(/^>\s*/gm, '');

  // 4. Remove citation chips e.g. [SRC-01], [EVIDENCE_1]
  text = text.replace(/\[(?:SRC|EVIDENCE)[-_0-9]+\]/gi, '');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 5. Headings: ensure clean boundary with trailing period
  text = text.replace(/^#{1,6}\s*(.*?)$/gm, (_m, p) => {
    const trimmed = p.trim();
    return trimmed ? `${trimmed}. ` : '';
  });

  // 6. Bullet points & numbered lists: ensure list item pauses
  text = text.replace(/^[*•-]\s*(.*?)$/gm, (_m, p) => {
    const trimmed = p.trim();
    return trimmed ? `${trimmed}${/[.!?]$/.test(trimmed) ? '' : '.'} ` : '';
  });

  text = text.replace(/^(\d+)\.\s*(.*?)$/gm, (_m, num, p) => {
    const trimmed = p.trim();
    return trimmed ? `Point ${num}: ${trimmed}${/[.!?]$/.test(trimmed) ? '' : '.'} ` : '';
  });

  // 7. Bold and italics formatting removal
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/(^|\s)\*([^*\n]+)\*(\s|$)/g, '$1$2$3');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  // 8. Remove any orphan formatting characters
  text = text.replace(/[*_#~]/g, '');

  // 9. Normalize spacing and punctuation
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\s+([.,!?:;])/g, '$1');
  text = text.replace(/\.{2,}/g, '.');

  return text.trim();
}

/**
 * Splits text into sentence-bounded chunks of reasonable length (max 200 chars)
 * to avoid browser speech synthesis timeouts on long texts.
 */
export function splitTextIntoSpeechChunks(text: string, maxChunkLength = 200): string[] {
  if (!text) return [];

  const sentenceRegex = /[^.!?]+(?:[.!?]+|$)/g;
  const rawSentences = text.match(sentenceRegex) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (!currentChunk) {
      if (trimmed.length <= maxChunkLength) {
        currentChunk = trimmed;
      } else {
        const words = trimmed.split(' ');
        let subChunk = '';
        for (const word of words) {
          if ((subChunk + ' ' + word).trim().length <= maxChunkLength) {
            subChunk = (subChunk ? subChunk + ' ' : '') + word;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = word;
          }
        }
        if (subChunk) currentChunk = subChunk;
      }
    } else if ((currentChunk + ' ' + trimmed).length <= maxChunkLength) {
      currentChunk += ' ' + trimmed;
    } else {
      chunks.push(currentChunk);
      if (trimmed.length <= maxChunkLength) {
        currentChunk = trimmed;
      } else {
        const words = trimmed.split(' ');
        let subChunk = '';
        for (const word of words) {
          if ((subChunk + ' ' + word).trim().length <= maxChunkLength) {
            subChunk = (subChunk ? subChunk + ' ' : '') + word;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = word;
          }
        }
        currentChunk = subChunk;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Selects the optimal English voice available in the current browser.
 */
function getPreferredVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Try Indian English voice
  const inVoice = voices.find(v => {
    const lang = v.lang.replace('_', '-');
    return lang.startsWith('en-IN') || v.name.toLowerCase().includes('india');
  });
  if (inVoice) return inVoice;

  // 2. Try Natural / Google English voices
  const naturalEn = voices.find(v => {
    return v.lang.startsWith('en') && (
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Jenny')
    );
  });
  if (naturalEn) return naturalEn;

  // 3. Default English voice
  const defaultEn = voices.find(v => v.lang.startsWith('en') && v.default);
  if (defaultEn) return defaultEn;

  // 4. Any English voice
  const anyEn = voices.find(v => v.lang.startsWith('en'));
  if (anyEn) return anyEn;

  return voices[0] || null;
}

class SpeechService {
  private activeMessageId: string | null = null;
  private isSpeaking = false;
  private currentChunks: string[] = [];
  private currentChunkIndex = 0;
  private keepAliveTimer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<SpeechListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Pre-warm voice lookup
        getPreferredVoice();
      };
    }
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener({
      activeMessageId: this.activeMessageId,
      isSpeaking: this.isSpeaking,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state: SpeechState = {
      activeMessageId: this.activeMessageId,
      isSpeaking: this.isSpeaking,
    };
    this.listeners.forEach(l => l(state));
  }

  public getActiveMessageId(): string | null {
    return this.activeMessageId;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public stop() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.clearKeepAlive();
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore cancel errors if any
    }

    this.activeMessageId = null;
    this.isSpeaking = false;
    this.currentChunks = [];
    this.currentChunkIndex = 0;
    this.notify();
  }

  public speak(messageId: string, rawText: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    // Toggle off if currently speaking the exact same message
    if (this.activeMessageId === messageId && this.isSpeaking) {
      this.stop();
      return;
    }

    // Stop previous utterance before starting new one
    this.stop();

    const cleanText = cleanMarkdownForSpeech(rawText);
    if (!cleanText) return;

    const chunks = splitTextIntoSpeechChunks(cleanText);
    if (chunks.length === 0) return;

    this.activeMessageId = messageId;
    this.isSpeaking = true;
    this.currentChunks = chunks;
    this.currentChunkIndex = 0;
    this.notify();

    // Start keep-alive interval for Chromium long-audio bug
    this.startKeepAlive();
    this.playNextChunk();
  }

  private playNextChunk() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (this.currentChunkIndex >= this.currentChunks.length) {
      // Finished all chunks naturally
      this.stop();
      return;
    }

    const chunkText = this.currentChunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = 0.98; // Natural, clear speaking pace for legal explanations
    utterance.pitch = 1.0;

    const voice = getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      this.currentChunkIndex++;
      this.playNextChunk();
    };

    utterance.onerror = (e) => {
      // Ignore user-initiated cancellation or interruption
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis playback error:', e);
      }
      this.stop();
    };

    window.speechSynthesis.speak(utterance);
  }

  private startKeepAlive() {
    this.clearKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  private clearKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }
}

export const speechService = new SpeechService();
