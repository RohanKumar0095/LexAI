import { API_BASE_URL } from '../../../services/apiClient';

export interface ComplaintData {
  type: string;
  situation: string;
  involvedParty: string;
  location: string;
  date?: string;
  desiredAction?: string;
  description?: string;
}

export async function generateComplaint(data: ComplaintData): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/complaints/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        type: data.type,
        situation: data.description || data.situation,
        involvedParty: data.involvedParty,
        location: data.location,
        date: data.date,
        desiredAction: data.desiredAction,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.draft) {
        return result.draft;
      }
    }
  } catch (err) {
    console.warn('Backend complaint generation failed, using local legal template fallback:', err);
  }

  const currentDateString = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, ${(data.location || 'NEW DELHI').toUpperCase()}
(Under Section 35 of the Consumer Protection Act, 2019)

In the matter of:
Complainant Name: [Your Name]
Address: [Your Address]

VERSUS

Opposite Party: ${data.involvedParty}
Address: [Opposite Party Address]

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

MOST RESPECTFULLY SHOWETH:
1. That the Complainant purchased/availed services on ${data.date || 'Recent date'} at ${data.location || 'India'}.
2. That the Opposite Party is engaged in business under: "${data.involvedParty}".
3. Details of grievance: ${data.description || data.situation}.
4. PRAYER:
   The Complainant prays for:
   - ${data.desiredAction || 'Full refund of the amount along with interest.'}
   - Rs. 15,000 as compensation for mental harassment.

Dated: ${currentDateString}
Place: ${data.location || 'New Delhi'}

[Signature of the Complainant]`;
}
