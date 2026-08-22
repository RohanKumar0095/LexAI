import type { Conversation, Message, Roadmap } from '../types/chat';
import type { DailyLaw, Scenario } from '../types/legal';
import { mockDailyLaws } from '../data/mockLaws';
import { mockConversations } from '../data/mockChats';
import { mockScenarios } from '../data/mockScenarios';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  /**
   * Send a chat message and receive a simulated assistant response.
   * PHASE 2: Replace with FastAPI endpoint POST /api/chat
   */
  async sendChatMessage(
    messageText: string,
    _history: Message[],
    explainMode: 'normal' | 'detailed' | 'personalized' = 'normal'
  ): Promise<Message> {
    await delay(1200); // Simulate network round-trip and LLM generation

    const lowerQuery = messageText.toLowerCase();
    
    // Dynamic matching of mock responses
    let content = '';
    let citations = undefined;
    let evidenceChecklist = undefined;
    let followUps = undefined;
    let roadmapId = undefined;

    if (lowerQuery.includes('phone') || lowerQuery.includes('police search') || lowerQuery.includes('stopped by police')) {
      content = `Based on what you've described under the **${explainMode}** perspective:
      
Your situation involves **Police Search Authority and Digital Privacy** under Indian law.

### What this means
In India, the police **cannot** search your phone or demand your passcode without a judicial warrant or strong, documentable grounds linking the device to an active investigation under BNSS (formerly CrPC). You are protected by your fundamental right to privacy.

### What you can do next
1. Ask the officer for the specific written order or warrant authorizing the search.
2. Politely state that you do not consent to unlocking your phone without a lawyer or a warrant.
3. Note the officer's name, designation, and badge number.
4. If forced, do not resist physically; submit under protest and file an official complaint later.`;
      
      citations = [
        {
          id: 'cit-art-21',
          title: 'Constitution of India',
          section: 'Article 21',
          url: 'https://www.constitutionofindia.net/articles/article-21-protection-of-life-and-personal-liberty/',
          context: 'Protection of life and personal liberty, which includes the fundamental right to privacy.'
        }
      ];
      evidenceChecklist = [
        'Time, date, and exact location of the stop',
        'Officer details (Name/Badge Number)',
        'List of verbal questions or demands made'
      ];
      followUps = [
        'Can I be detained for refusing to show my phone?',
        'What is the procedure if they seize my phone?'
      ];
      roadmapId = 'police-stop-roadmap';

    } else if (lowerQuery.includes('evict') || lowerQuery.includes('tenant') || lowerQuery.includes('landlord')) {
      content = `Based on what you've described under the **${explainMode}** perspective:
      
This falls under **Residential Tenancy Law** and eviction procedures in India.

### What this means
A landlord cannot evict a tenant without a valid legal cause (e.g., failure to pay rent, causing structural damage, or violating specific clauses in a registered contract) and must provide a formal written notice (usually 15-30 days) and file an eviction petition before the Rent Control Court. Verbal notices are not legally valid.

### What you can do next
1. Review your registered lease agreement for notice clauses.
2. Send a formal reply requesting a written notice and outlining your compliant tenancy status.
3. Continue to deposit your rent on time (keep receipts/bank records).
4. Approach the Rent Control Court if the landlord threatens physical lockouts or utility disconnection.`;
      
      citations = [
        {
          id: 'cit-tpa-106',
          title: 'Transfer of Property Act, 1882',
          section: 'Section 106',
          url: 'https://indiankanoon.org/doc/1715873/',
          context: 'Written notice requirements for terminating a tenancy lease.'
        }
      ];
      evidenceChecklist = [
        'Registered tenancy agreement',
        'Bank statements showing timely rent transfers',
        'Copies of verbal or written threats from landlord'
      ];
      followUps = [
        'What should I do if my landlord cuts my water/electricity?',
        'Can a landlord raise the rent arbitrarily?'
      ];
      
    } else if (lowerQuery.includes('cyber') || lowerQuery.includes('fraud') || lowerQuery.includes('lost money') || lowerQuery.includes('bank')) {
      content = `Based on what you've described:
      
This is a **Financial Cyber Fraud** incident requiring urgent legal and technical intervention.

### What this means
You have been targeted by online fraudsters. In India, reporting financial cyber crime within the first 2 hours increases the likelihood of banks freezing and recovering the transferred amount from the receiver's nodes.

### What you must do immediately
1. Call the National Cyber Crime Helpline at **1930** right now.
2. Contact your bank to block your accounts, cards, and UPI handlers immediately.
3. Submit a complaint on the National Cyber Crime Portal: **cybercrime.gov.in**.
4. Visit the nearest cyber cell with transaction records.`;
      
      citations = [
        {
          id: 'cit-it-66d',
          title: 'IT Act, 2000',
          section: 'Section 66D',
          url: 'https://indiankanoon.org/doc/1841344/',
          context: 'Punishment for cheating by personation by using computer resources.'
        }
      ];
      evidenceChecklist = [
        'Phishing SMS, link URL, or chat screenshots',
        'Official Bank statement showing transaction transaction ID',
        'Fraud caller phone number and network provider info'
      ];
      followUps = [
        'How do I track my cybercrime complaint status?',
        'What are the RBI rules on customer liability for bank fraud?'
      ];
      roadmapId = 'cyber-fraud-roadmap';

    } else if (lowerQuery.includes('fir') || lowerQuery.includes('complaint at police') || lowerQuery.includes('file an fir')) {
      content = `Based on your request:
      
This relates to the procedure for **Filing a First Information Report (FIR)** under Section 173 of the BNSS (formerly Section 154 of the CrPC).

### What this means
An FIR is the initial step for investigating a cognizable (serious) offence. Police officers cannot refuse to register an FIR for a cognizable offence. If they refuse, you have statutory remedies.

### What you can do next
1. Go to the police station in whose jurisdiction the crime occurred.
2. Provide a clear statement (written or verbal). If verbal, they must write it down and read it to you.
3. Make sure to collect a copy of the FIR for free.
4. If refused, write to the Superintendent of Police (SP) or use the "Zero FIR" facility.`;
      
      citations = [
        {
          id: 'cit-crpc-154',
          title: 'Code of Criminal Procedure',
          section: 'Section 154',
          url: 'https://indiankanoon.org/doc/1980557/',
          context: 'Procedure for registering information in cognizable cases.'
        }
      ];
      evidenceChecklist = [
        'Date, time, and timeline of the incident',
        'Name/description of suspects',
        'Names and contacts of any eye-witnesses',
        'Physical or digital evidence of the offense'
      ];
      followUps = [
        'What is a Zero FIR and when can I use it?',
        'What happens if a police officer refuses to file my FIR?'
      ];
      roadmapId = 'fir-roadmap';

    } else {
      // General Response
      content = `Thank you for asking LexAI India. I am processing your query under the **${explainMode}** setting.

### Summary of Information
Based on your question: "${messageText}", here is the general legal context under Indian law:
1. Under Indian statutes, your rights depend heavily on whether you are dealing with a civil matter (like consumer rights or property) or a criminal matter (like fraud or police interactions).
2. It is highly recommended to gather all written agreements, letters, messages, or transaction proofs to document the facts.

### What you should do next
1. **Define the category:** Determine if your issue is a Consumer, Cyber, Property, or Constitutional dispute.
2. **Collect evidence:** Keep all communication, emails, bills, and notifications safe.
3. **Seek formal resources:** Use official portals like E-Daakhil for consumer disputes, or 1930 for cyber fraud.

*Disclaimer: LexAI India provides general legal awareness and information. This does not constitute professional legal advice. For representation, please contact a qualified advocate or the Legal Services Authority.*`;
      
      citations = [
        {
          id: 'cit-gen',
          title: 'Constitution of India',
          section: 'Article 14',
          url: 'https://indiankanoon.org/doc/367586/',
          context: 'Equality before law and equal protection of the laws.'
        }
      ];
      evidenceChecklist = [
        'All agreements or invoices related to the query',
        'Screenshots of electronic correspondence',
        'Chronological timeline of events'
      ];
      followUps = [
        'Can you show me the relevant government portal to resolve this?',
        'What are the timeline limits to file a complaint for this?'
      ];
    }

    return {
      id: `msg-mock-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations,
      evidenceChecklist,
      followUps,
      roadmapId,
      explainMode
    };
  },

  /**
   * Fetch today's featured Daily Law
   * PHASE 2: Replace with FastAPI GET /api/laws/daily
   */
  async getTodayLaw(): Promise<DailyLaw> {
    await delay(300);
    return mockDailyLaws[0];
  },

  /**
   * Fetch all daily laws archive
   * PHASE 2: Replace with FastAPI GET /api/laws/archive
   */
  async getDailyLawsArchive(): Promise<DailyLaw[]> {
    await delay(400);
    return mockDailyLaws;
  },

  /**
   * Fetch mock chat history
   * PHASE 2: Replace with FastAPI GET /api/chats
   */
  async getChatHistory(): Promise<Conversation[]> {
    await delay(300);
    return mockConversations;
  },

  /**
   * Fetch all guided scenarios
   * PHASE 2: Replace with FastAPI GET /api/scenarios
   */
  async getScenarios(): Promise<Scenario[]> {
    await delay(300);
    return mockScenarios;
  },

  /**
   * Mock document analysis function
   * PHASE 2: Replace with FastAPI POST /api/documents/analyze
   */
  async analyzeDocument(fileName: string, fileType: string): Promise<{
    summary: string;
    clauses: { title: string; text: string; page?: number }[];
    terms: { term: string; meaning: string }[];
    riskFlags: { title: string; severity: 'low' | 'medium' | 'high'; description: string }[];
  }> {
    await delay(2000); // Simulate intensive OCR and LLM analysis

    return {
      summary: `This is a mock legal analysis of the uploaded document: "${fileName}". The document appears to be a standard ${fileType.toUpperCase() || 'Agreement/Contract'} governing obligations and rights between the participating parties.`,
      clauses: [
        {
          title: 'Notice Period Clause',
          text: 'Either party may terminate this agreement by giving 30 days written notice to the other party.',
          page: 1
        },
        {
          title: 'Arbitration and Governing Law',
          text: 'This agreement shall be governed by and construed in accordance with the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in New Delhi.',
          page: 3
        }
      ],
      terms: [
        {
          term: 'Force Majeure',
          meaning: 'Unforeseeable circumstances (like natural disasters, war) that prevent someone from fulfilling a contract obligation, releasing them from liability.'
        },
        {
          term: 'Indemnification',
          meaning: 'A contractual agreement where one party promises to compensate the other party for any loss, damage, or legal liability incurred.'
        }
      ],
      riskFlags: [
        {
          title: 'Short Termination Notice',
          severity: 'medium',
          description: 'A 3-day or immediate termination clause is heavily tilted in favor of one party and could cause business disruption.'
        },
        {
          title: 'Arbitrary Rent Increment (For Rent Agreements)',
          severity: 'high',
          description: 'The document permits the landlord to increase rent by 20% at any time without prior written notice, violating standard rent protocols.'
        },
        {
          title: 'Vague Indemnity Liabilities',
          severity: 'medium',
          description: 'The clause holds the signer liable for all operational losses including third-party acts, which is excessively broad.'
        }
      ]
    };
  },

  /**
   * Mock Legal Complaint/Document generator
   * PHASE 2: Replace with FastAPI POST /api/complaints/generate
   */
  async generateComplaint(data: {
    type: string;
    situation: string;
    date: string;
    location: string;
    involvedParty: string;
    description: string;
    desiredAction: string;
  }): Promise<string> {
    await delay(1500); // Simulate generative AI delay

    const currentDateString = new Date().toLocaleDateString();

    return `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, ${data.location.toUpperCase()}
(Under the Consumer Protection Act, 2019)

In the matter of:
Complainant Name: [Your Name]
Address: [Your Address]

VERSUS

Opposite Party: ${data.involvedParty}
Address: [Opposite Party Address]

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

MOST RESPECTFULLY SHOWETH:

1. That the Complainant is a consumer who purchased/availed services on ${data.date} at ${data.location}.
2. That the Opposite Party is engaged in the business of supplying/providing: "${data.involvedParty}".
3. Details of the dispute:
   - On ${data.date}, the Complainant faced the following issue: ${data.description}.
   - The primary complaint is: ${data.situation}.
4. That the Complainant contacted the Opposite Party multiple times, but they refused to resolve the grievance, which constitutes a "Deficiency in Service" and an "Unfair Trade Practice" under the Act.
5. PRAYER / DESIRED ACTION:
   The Complainant respectfully prays that this Commission may be pleased to direct the Opposite Party to:
   - ${data.desiredAction || 'Provide full refund of the amount along with interest.'}
   - Pay a sum of Rs. 10,000 as compensation for mental harassment and litigation costs.

Dated: ${currentDateString}
Place: ${data.location}

[Signature of the Complainant]
[Name of the Complainant]`;
  },

  /**
   * Mock roadmap generator
   * PHASE 2: Replace with FastAPI GET /api/roadmaps
   */
  async generateRoadmap(roadmapId: string): Promise<Roadmap> {
    await delay(500);

    const roadmaps: Record<string, Roadmap> = {
      'police-stop-roadmap': {
        id: 'police-stop-roadmap',
        title: 'Roadmap: Vehicle Stop Rights',
        steps: [
          {
            number: 1,
            title: 'Verify Officer Credentials',
            description: 'Ask the traffic officer for their identity card and check their rank. Note the name/badge.',
            documents: ['Officer Rank Badge / Nameplate'],
            rights: ['Right to identify the officer before replying'],
            notes: 'A police constable cannot fine you on the spot; only a Sub-Inspector or above can.'
          },
          {
            number: 2,
            title: 'Show Digital / Physical Documents',
            description: 'Show your DL, RC, Insurance, and PUC. You can use DigiLocker or mParivahan.',
            documents: ['Driving License', 'RC', 'Insurance Policy', 'PUC Certificate'],
            rights: ['DigiLocker documents are legally valid under IT Act, 2000'],
            notes: 'Do not hand over physical documents to avoid confiscation threats; displaying digital copies is sufficient.'
          },
          {
            number: 3,
            title: 'Handle Challan or Fine',
            description: 'Verify the fine amount and official receipt. Do not pay without an official print or SMS record.',
            documents: ['Official E-Challan Receipt'],
            rights: ['Right to pay fine online later or contest it in court'],
            notes: 'If fine is paid on-spot, demand a printed receipt stating the officer\'s details.'
          }
        ]
      },
      'cyber-fraud-roadmap': {
        id: 'cyber-fraud-roadmap',
        title: 'Roadmap: Reporting Cyber Fraud',
        steps: [
          {
            number: 1,
            title: 'Immediate Account Block',
            description: 'Contact your bank via official helpline or app to freeze cards, net banking, and UPI payments.',
            documents: ['Bank Account Passbook/Card details'],
            rights: ['Zero customer liability if reported within 3 days (RBI guidelines)'],
            notes: 'This stops further money leakage.'
          },
          {
            number: 2,
            title: 'Dial 1930 Cyber Helpline',
            description: 'Report the transaction details (bank, amount, transaction ID) immediately to operators.',
            documents: ['UPI/Transaction Ref Number'],
            rights: ['Interbank coordination to freeze funds in fraud accounts'],
            notes: 'Do this in the first 2 hours for best recovery chances.'
          },
          {
            number: 3,
            title: 'Register Complaint on Cyber Portal',
            description: 'Submit an online complaint on cybercrime.gov.in with screenshots of threats and transaction bills.',
            documents: ['Screenshots of scam messages/links', 'Bank statement PDF'],
            rights: ['Right to receive an online acknowledgement number (Acknowledge slip)'],
            notes: 'This generates an official complaint code for police investigations.'
          }
        ]
      },
      'fir-roadmap': {
        id: 'fir-roadmap',
        title: 'Roadmap: Filing an FIR',
        steps: [
          {
            number: 1,
            title: 'Identify Correct Jurisdiction',
            description: 'Go to the nearest police station where the incident occurred. If you do not know, go to any station.',
            rights: ['Right to file a Zero FIR at any station (to be transferred later)'],
            notes: 'Police cannot reject filing a serious crime because it is outside their area.'
          },
          {
            number: 2,
            title: 'Draft the Information Statement',
            description: 'Provide details verbally or in writing. If verbal, the officer must write it down.',
            documents: ['Draft of the incident narration'],
            rights: ['Right to have the statement read back to you before signing'],
            notes: 'Ensure all key details, dates, and times are written accurately.'
          },
          {
            number: 3,
            title: 'Collect signed copy for free',
            description: 'Obtain the official FIR printout with station stamp and officer signature.',
            documents: ['Copy of FIR'],
            rights: ['Right to get a copy of the FIR free of charge immediately (Sec 154 CrPC)'],
            notes: 'Keep this copy safe for all future court or insurance procedures.'
          }
        ]
      }
    };

    return roadmaps[roadmapId] || {
      id: 'custom-roadmap',
      title: `Roadmap: ${roadmapId.replace('-', ' ')}`,
      steps: [
        {
          number: 1,
          title: 'Collect evidence',
          description: 'Document and gather all relevant evidence including bills, chat logs, photos, and emails.'
        },
        {
          number: 2,
          title: 'Identify correct legal forum',
          description: 'Figure out the jurisdiction (local police station, consumer court, or labor commissioner).'
        },
        {
          number: 3,
          title: 'File formal complaint',
          description: 'Draft the grievance, attach evidence, and submit online or physically, keeping copy proofs.'
        }
      ]
    };
  }
};
export default apiService;
