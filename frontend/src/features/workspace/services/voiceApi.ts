import { API_BASE_URL, parseApiError } from '../../../services/apiClient';

export interface TranscribeResponse {
  transcription: string;
}

/**
 * Uploads captured microphone audio to the backend Gemini transcription endpoint.
 *
 * @param audioBlob The recorded audio Blob (WebM, OGG, WAV, etc.)
 * @param mimeType The detected recording MIME type
 * @returns Promise resolving to the faithful transcription string
 */
export async function transcribeAudio(
  audioBlob: Blob,
  mimeType: string = 'audio/webm'
): Promise<string> {
  const token = localStorage.getItem('lexai_auth_token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Derive an appropriate file extension based on MIME type
  let extension = 'webm';
  if (mimeType.includes('wav')) extension = 'wav';
  else if (mimeType.includes('ogg')) extension = 'ogg';
  else if (mimeType.includes('mp4')) extension = 'mp4';
  else if (mimeType.includes('mpeg') || mimeType.includes('mp3')) extension = 'mp3';

  const formData = new FormData();
  formData.append('file', audioBlob, `recording_${Date.now()}.${extension}`);

  const response = await fetch(`${API_BASE_URL}/api/v1/rag/transcribe`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorMsg = await parseApiError(response);
    throw new Error(errorMsg);
  }

  const data: TranscribeResponse = await response.json();
  return (data.transcription || '').trim();
}
