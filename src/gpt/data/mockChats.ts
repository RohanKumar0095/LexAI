import type { Conversation } from '../types/chat';

export const mockConversations: Conversation[] = [
  {
    id: 'police-stop',
    title: 'Police stop — what are my rights?',
    category: 'Police Rights',
    timestamp: '10:32 PM',
    preview: 'I was stopped by police while travelling...',
    dateGroup: 'today',
    pinned: false,
    messages: [
      {
        id: 'ps-1',
        role: 'user',
        content: 'I was stopped by the police while driving. They wanted to search my phone. Can police search my phone without permission?',
        timestamp: '10:30 PM'
      },
      {
        id: 'ps-2',
        role: 'assistant',
        content: 'Based on what you\'ve described, your situation involves police search rights, particularly regarding personal digital devices under Indian law.\n\n### What this means\nIn India, the police **cannot** search your phone without permission or a proper warrant under ordinary circumstances. While the police have general search powers under Section 165 of the CrPC (now Section 185 of the Bharatiya Nagarik Suraksha Sanhita - BNSS) to search premises, this does not give them an automatic right to demand your phone passcode or browse your private messages without reasonable grounds related to a specific investigation.\n\n### What you can do next\n1. **Ask for the reason:** Politely ask the officer under what section or investigation they are requesting the search.\n2. **Politely deny consent:** State clearly and politely that you do not consent to a search of your personal device without a legal warrant.\n3. **Note down details:** Record the officer\'s name, buckle number, and police station if possible.\n4. **Stay calm:** Do not behave aggressively or resist physically, as that can lead to charges of obstructing a public servant.\n\n### Relevant Law\n* **Article 21 of the Indian Constitution:** Right to Privacy (declared a fundamental right in the Puttaswamy judgment).\n* **Article 20(3) of the Indian Constitution:** Protection against self-incrimination (you cannot be compelled to be a witness against yourself, which includes forced passwords).\n* **Supreme Court Guidelines:** Under recent rulings, digital privacy is highly protected, and forced searches require judicial oversight.',
        timestamp: '10:32 PM',
        citations: [
          {
            id: 'cit-art-21',
            title: 'Constitution of India',
            section: 'Article 21',
            url: 'https://www.constitutionofindia.net/articles/article-21-protection-of-life-and-personal-liberty/',
            context: 'Protection of life and personal liberty, which includes the fundamental right to privacy.'
          },
          {
            id: 'cit-art-20',
            title: 'Constitution of India',
            section: 'Article 20(3)',
            url: 'https://www.constitutionofindia.net/articles/article-20-relations-to-conviction-for-offences/',
            context: 'No person accused of any offence shall be compelled to be a witness against himself.'
          }
        ],
        evidenceChecklist: [
          'Note down the location and time of the incident.',
          'Identify officer name and badge number.',
          'List any witnesses who observed the interaction.',
          'Preserve any video or audio recordings if available.'
        ],
        followUps: [
          'What should I do if they threaten to detain me?',
          'Is the rule different if they have a search warrant?',
          'How do I file a complaint against an officer?'
        ],
        roadmapId: 'police-stop-roadmap',
        explainMode: 'normal'
      }
    ]
  },
  {
    id: 'tenant-eviction',
    title: 'Tenant eviction notice',
    category: 'Property & Rent',
    timestamp: '08:45 PM',
    preview: 'My landlord has given me an eviction notice...',
    dateGroup: 'today',
    pinned: false,
    messages: [
      {
        id: 'te-1',
        role: 'user',
        content: 'My landlord gave me a 3-day verbal notice to evict the apartment because he wants to rent it for a higher price. Is this legal?',
        timestamp: '08:43 PM'
      },
      {
        id: 'te-2',
        role: 'assistant',
        content: 'No, a verbal 3-day notice to evict is **not legal** under Indian tenancy laws.\n\n### What this means\nLandlord-tenant relationships are governed by state-specific Rent Control Acts and the Model Tenancy Act. A landlord cannot evict a tenant arbitrarily without a valid legal ground (such as non-payment of rent, subletting without permission, or misuse of property) and must follow a formal process, which includes serving a written notice (usually 15 to 30 days depending on the agreement) followed by a petition to the Rent Controller if you do not vacate.\n\n### What you can do next\n1. **Check your rent agreement:** Verify the notice period clause in your registered rent agreement (standard is 30 days).\n2. **Demand written communication:** Inform the landlord politely that any eviction notice must be in writing as per the agreement and law.\n3. **Pay rent on time:** Ensure you continue to pay rent via bank transfer or cheque to prove you are not defaulting.\n4. **Consult a local lawyer:** If the landlord threatens forced eviction, you can file for a temporary injunction in civil court.\n\n### Relevant Law\n* **Section 106 of the Transfer of Property Act, 1882:** Requires a written notice of 15 days for residential tenancies.\n* **Model Tenancy Act, 2021:** Outlines strict judicial processes for landlord recovery of possession.',
        timestamp: '08:45 PM',
        citations: [
          {
            id: 'cit-tpa-106',
            title: 'Transfer of Property Act, 1882',
            section: 'Section 106',
            url: 'https://indiankanoon.org/doc/1715873/',
            context: 'Requires written notice of termination of lease, specifying 15 days notice for residential tenancies.'
          }
        ],
        evidenceChecklist: [
          'Copy of registered rent agreement.',
          'Receipts/proof of all past rent payments.',
          'Screenshots of any messages or calls regarding the verbal threat.',
          'Written reply to the verbal demand demanding formal process.'
        ],
        followUps: [
          'Can my landlord cut off my water or electricity supply?',
          'What happens if my lease agreement is expired?',
          'How do I file a complaint with the Rent Control Court?'
        ],
        explainMode: 'normal'
      }
    ]
  },
  {
    id: 'cyber-fraud',
    title: 'Cyber fraud complaint',
    category: 'Cyber Crime',
    timestamp: 'Yesterday, 06:20 PM',
    preview: 'I lost money in an online scam...',
    dateGroup: 'yesterday',
    pinned: false,
    messages: [
      {
        id: 'cf-1',
        role: 'user',
        content: 'I got a call claiming my electricity would be disconnected. I clicked a link they sent and lost Rs. 50,000 from my bank account. What should I do immediately?',
        timestamp: '06:18 PM'
      },
      {
        id: 'cf-2',
        role: 'assistant',
        content: 'This is a critical situation. You need to act **immediately** within the "golden hour" to maximize chances of freezing and recovering your money.\n\n### What this means\nYou have been a victim of vishing (voice phishing) and financial cyber fraud. Cyber criminals use urgency (like threatening electricity cutoff) to trick targets into clicking phishing links or revealing bank credentials.\n\n### What you must do immediately\n1. **Call 1930:** Dial the National Cyber Crime Helpline (1930) immediately to report the transaction. The helpline operator can initiate the blocking of the money flow before the fraudster withdraws it.\n2. **Block Bank Account:** Inform your bank\'s customer care immediately to block your debit/credit card, UPI, and internet banking.\n3. **File Online Complaint:** Visit the National Cyber Crime Portal ([cybercrime.gov.in](https://cybercrime.gov.in)) and file an official complaint.\n4. **Notify Local Police:** Save transaction receipts and go to the nearest cyber police station or cyber cell.\n\n### Relevant Law\n* **Section 66D of the IT Act:** Punishment for cheating by personation using computer resources.\n* **RBI Guidelines on Zero Liability:** If you notify the bank within 3 days of unauthorized electronic transactions, your liability is limited.',
        timestamp: 'Yesterday, 06:20 PM',
        citations: [
          {
            id: 'cit-it-66d',
            title: 'Information Technology Act, 2000',
            section: 'Section 66D',
            url: 'https://indiankanoon.org/doc/1841344/',
            context: 'Punishment for cheating by personation by using computer resources (imprisonment up to 3 years and fine up to 1 lakh).'
          },
          {
            id: 'cit-rbi-liab',
            title: 'RBI Circular',
            section: 'Customer Protection - Limiting Liability',
            url: 'https://www.rbi.org.in/commonman/English/Scripts/Notification.aspx?Id=2334',
            context: 'Zero liability for customers if third-party breaches are reported to the bank within 3 days.'
          }
        ],
        evidenceChecklist: [
          'Screenshot of the threatening SMS/WhatsApp message.',
          'Screenshot of the link URL clicked.',
          'Bank statement highlighting the fraud transaction with date/time.',
          'Phone call logs showing the caller number.'
        ],
        followUps: [
          'How do I file a complaint on cybercrime.gov.in?',
          'What happens if the bank refuses to freeze my account?',
          'Can I recover my money if the police find the fraudster?'
        ],
        roadmapId: 'cyber-fraud-roadmap',
        explainMode: 'normal'
      }
    ]
  },
  {
    id: 'consumer-refund',
    title: 'Consumer refund issue',
    category: 'Consumer Rights',
    timestamp: '2 days ago',
    preview: 'I bought a defective product...',
    dateGroup: 'week',
    pinned: false,
    messages: [
      {
        id: 'cr-1',
        role: 'user',
        content: 'I bought a laptop online. It arrived with a broken screen, but the website is refusing to refund or replace it, saying I damaged it myself. What can I do?',
        timestamp: '3 days ago'
      },
      {
        id: 'cr-2',
        role: 'assistant',
        content: 'Under Indian consumer protection law, you are protected against defective products and unfair trade practices.\n\n### What this means\nE-commerce portals are legally liable for delivering damaged goods. Accusing the customer without proof while refusing replacement violates the Consumer Protection Act, 2019.\n\n### What you can do next\n1. **Register with NCH:** File a complaint with the National Consumer Helpline (NCH) via their portal or app, or call 1915. Most major e-commerce platforms resolve issues quickly here.\n2. **Send a Legal Notice:** If unresolved, draft a formal legal notice giving them 15 days to refund/replace, or face consumer court.\n3. **File on E-Daakhil:** File a formal case online via the e-daakhil portal ([edaakhil.nic.in](https://edaakhil.nic.in)) at the District Consumer Disputes Redressal Commission.\n\n### Relevant Law\n* **Consumer Protection Act, 2019:** Establishes product liability and protection against unfair contracts and trade practices.\n* **E-Commerce Rules, 2020:** Mandates transparent grievance redressal and return/refund policies for online sellers.',
        timestamp: '2 days ago',
        citations: [
          {
            id: 'cit-cpa-2019',
            title: 'Consumer Protection Act, 2019',
            section: 'Section 2(47)',
            url: 'https://indiankanoon.org/doc/170669145/',
            context: 'Defines "unfair trade practice" which includes refusing to take back defective goods or refund money within the period stipulated.'
          }
        ],
        evidenceChecklist: [
          'Unboxing video or photos of the package and damaged laptop immediately upon delivery.',
          'Copy of the invoice and order confirmation.',
          'Chat logs and emails exchanged with the customer support team.',
          'Copy of the refusal reply from the website.'
        ],
        followUps: [
          'How do I file a case on E-Daakhil?',
          'Is an unboxing video mandatory to win a consumer case?',
          'Can I claim compensation for mental harassment?'
        ],
        explainMode: 'normal'
      }
    ]
  },
  {
    id: 'how-to-fir',
    title: 'How to file an FIR?',
    category: 'Police Rights',
    timestamp: '5 days ago',
    preview: 'I want to file an FIR...',
    dateGroup: 'week',
    pinned: false,
    messages: [
      {
        id: 'hf-1',
        role: 'user',
        content: 'What is the correct procedure to file an FIR at a police station? Can they refuse to file it?',
        timestamp: '5 days ago'
      },
      {
        id: 'hf-2',
        role: 'assistant',
        content: 'An First Information Report (FIR) is the official document prepared by police when they receive information about the commission of a cognizable offence.\n\n### What this means\nFor serious crimes (cognizable offences like theft, assault, fraud), police are **legally bound** to register an FIR immediately. They cannot refuse to register it under Section 154 of the CrPC (now Section 173 of the BNSS). For minor/non-cognizable offences, they record it in a NCR (Non-Cognizable Report) and require a court order to investigate.\n\n### What you can do next\n1. **Approach the Station Officer:** Go to the police station and demand to speak to the officer-in-charge.\n2. **Provide clear statement:** Give details of the incident. It can be written or verbal (if verbal, the police officer must write it down and read it back to you).\n3. **Get a free copy:** Ensure you receive a signed copy of the FIR immediately for free; it is your legal right.\n4. **If they refuse - Use Zero FIR:** If the incident occurred elsewhere, they must register a "Zero FIR" and transfer it to the concerned station.\n5. **If they still refuse:** Send your complaint in writing to the Superintendent of Police (SP) by registered post, or file a complaint before the Judicial Magistrate.\n\n### Relevant Law\n* **Section 154 CrPC / Section 173 BNSS:** Legal mandate to register FIR for cognizable cases.\n* **Section 166A Indian Penal Code (IPC):** Punishment for public servants refusing to register an FIR (imprisonment up to 2 years).',
        timestamp: '5 days ago',
        citations: [
          {
            id: 'cit-crpc-154',
            title: 'Code of Criminal Procedure, 1973',
            section: 'Section 154',
            url: 'https://indiankanoon.org/doc/1980557/',
            context: 'Mandatory registration of information in cognizable cases.'
          },
          {
            id: 'cit-ipc-166a',
            title: 'Indian Penal Code, 1860',
            section: 'Section 166A',
            url: 'https://indiankanoon.org/doc/593883/',
            context: 'Public servant disobeying law, specifically by failing to record any information given to him under Section 154 of CrPC.'
          }
        ],
        evidenceChecklist: [
          'Detailed written description of the incident with dates and timings.',
          'List of names/descriptions of suspects and witnesses.',
          'Medical reports if the crime involved physical injury.',
          'Receipt of written submission if police refuse verbal FIR.'
        ],
        followUps: [
          'What is a Zero FIR?',
          'What is the difference between a cognizable and non-cognizable offence?',
          'How do I check my FIR status online?'
        ],
        roadmapId: 'fir-roadmap',
        explainMode: 'normal'
      }
    ]
  },
  {
    id: 'salary-dispute',
    title: 'Salary Dispute',
    category: 'Employment Rights',
    timestamp: '10 days ago',
    preview: 'I am facing delayed payments from my employer...',
    dateGroup: 'older',
    pinned: false,
    messages: [
      {
        id: 'sd-1',
        role: 'user',
        content: 'I worked at a private firm for 3 months. My employer delayed my salary for the last 2 months and now terminated me without pay. What are my options?',
        timestamp: '10 days ago'
      },
      {
        id: 'sd-2',
        role: 'assistant',
        content: 'In India, employees are protected against delayed salary payments and wrongful termination under labour laws.\n\n### What this means\nEmployers cannot withhold earned wages or terminate services without following the agreed notice period or contract rules, subject to the Payment of Wages Act, 1936.\n\n### What you can do next\n1. **Send a Demand Email:** Write a formal email demanding unpaid salary and outlining severance dues.\n2. **File a labor complaint:** Contact the regional Labor Commissioner office.\n3. **Send a legal notice:** Engage a legal counsel to send a recovery notice.',
        timestamp: '10 days ago',
        explainMode: 'normal'
      }
    ]
  },
  {
    id: 'road-accident',
    title: 'Road Accident — What Should I Do?',
    category: 'Traffic Rights',
    timestamp: '12 days ago',
    preview: 'My vehicle was hit by a truck...',
    dateGroup: 'older',
    pinned: false,
    messages: [
      {
        id: 'ra-1',
        role: 'user',
        content: 'My car was hit from behind by a speeding commercial truck. The driver is blaming me. What should I do immediately to protect myself?',
        timestamp: '12 days ago'
      },
      {
        id: 'ra-2',
        role: 'assistant',
        content: 'Under the Motor Vehicles Act, you have duties and rights in a collision.\n\n### What this means\nImmediately document the damage, seek medical help for any injuries, and report to the police cell.\n\n### What you can do next\n1. **Take Photos:** Capture the vehicles, damage, and truck registration plate.\n2. **Call 112:** Notify police immediately to get a spot check or diary entry.\n3. **Call Insurance:** Notify your motor insurer to initiate claims.',
        timestamp: '12 days ago',
        explainMode: 'normal'
      }
    ]
  }
];
