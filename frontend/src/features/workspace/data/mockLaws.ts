import type { DailyLaw } from '../types/legal';

export const mockDailyLaws: DailyLaw[] = [
  {
    id: 'police-phone-search',
    title: 'Can police search your phone without permission?',
    explanation: 'Under Indian law, the Right to Privacy is protected as a fundamental right. Police officers do not have the arbitrary authority to demand your phone, passcode, or search its contents unless they are executing a specific search warrant issued by a court, or have formal, documentable grounds directly linking the device contents to an active investigation of a cognizable offence.',
    example: 'Rajiv was stopped at a routine traffic checkpoint. The officer asked him to unlock his smartphone to see if he had any chat messages discussing protest events. Rajiv politely declined, stating his right to digital privacy under Article 21, and the officer had to let him proceed since there was no warrant or pending criminal complaint against him.',
    readMoreUrl: 'https://indiankanoon.org/doc/127517806/',
    date: 'Today',
    quizQuestions: [
      {
        id: 'q1-1',
        question: 'Under which Article of the Constitution is the Right to Privacy protected in India?',
        options: [
          'Article 14 (Right to Equality)',
          'Article 19 (Freedom of Speech)',
          'Article 21 (Protection of Life and Personal Liberty)',
          'Article 32 (Constitutional Remedies)'
        ],
        correctAnswerIndex: 2,
        explanation: 'The Supreme Court of India in the landmark K.S. Puttaswamy case (2017) ruled that the Right to Privacy is an integral part of the Right to Life and Personal Liberty under Article 21.',
        xpReward: 50
      },
      {
        id: 'q1-2',
        question: 'If police demand to search your phone without a warrant, what is the legally appropriate response?',
        options: [
          'Hand over the phone and passcode immediately out of fear',
          'Politely deny consent and ask for the legal basis/warrant of the request',
          'Argue loudly and run away from the spot',
          'Attempt to delete all data on the phone in front of them'
        ],
        correctAnswerIndex: 1,
        explanation: 'You should remain calm and polite, deny consent to search your personal device, and ask the officer to provide a warrant or state the specific legal authority/grounds under which they are conducting the search.',
        xpReward: 50
      }
    ]
  },
  {
    id: 'free-legal-aid',
    title: 'Right to Free Legal Aid in India',
    explanation: 'Article 39A of the Indian Constitution directs the state to provide free legal aid to ensure that justice is not denied to any citizen due to economic or other disabilities. Under the Legal Services Authorities Act, 1987, eligible citizens (including women, children, SC/ST members, and persons earning below a state-specified limit) can get free legal representation, advice, and drafting services.',
    example: 'Sunita, a domestic worker facing an unfair eviction, approached the District Legal Services Authority (DLSA). Because she was eligible, they assigned her an advocate for free to represent her in the Rent Control tribunal.',
    readMoreUrl: 'https://nalsa.gov.in/free-legal-services',
    date: 'Yesterday',
    quizQuestions: [
      {
        id: 'q2-1',
        question: 'Which constitutional amendment added Article 39A (Free Legal Aid) to the Directive Principles?',
        options: [
          '42nd Amendment Act, 1976',
          '44th Amendment Act, 1978',
          '86th Amendment Act, 2002',
          '73rd Amendment Act, 1992'
        ],
        correctAnswerIndex: 0,
        explanation: 'Article 39A was inserted by the 42nd Amendment Act in 1976 to promote justice on the basis of equal opportunity.',
        xpReward: 50
      }
    ]
  },
  {
    id: 'mrp-rights',
    title: 'What to do if a store charges more than the MRP?',
    explanation: 'It is illegal for any seller to charge more than the Maximum Retail Price (MRP) printed on goods under the Legal Metrology Act, 2009. The MRP is inclusive of all taxes, and selling above it is considered an unfair trade practice under the Consumer Protection Act.',
    example: 'Anil bought a bottle of mineral water at a movie theater where the cashier demanded Rs. 60, though the printed MRP was Rs. 20. Anil took a photo of the bill showing the overcharge and registered a complaint on the National Consumer Helpline, leading to a penalty on the establishment.',
    readMoreUrl: 'https://consumerhelpline.gov.in/',
    date: '2 days ago',
    quizQuestions: [
      {
        id: 'q3-1',
        question: 'Does the Maximum Retail Price (MRP) include GST and other taxes?',
        options: [
          'No, GST is added on top of the MRP at the billing counter',
          'Yes, the MRP is legally inclusive of all taxes',
          'Only for grocery items, not for electronics',
          'It depends on the state\'s local rules'
        ],
        correctAnswerIndex: 1,
        explanation: 'Under the Legal Metrology (Packaged Commodities) Rules, the MRP printed on a package must be inclusive of all taxes. Charging any tax on top of MRP is a punishable offence.',
        xpReward: 50
      }
    ]
  },
  {
    id: 'call-recording',
    title: 'Is recording a phone call legal in India?',
    explanation: 'Recording a phone call without the other party\'s consent occupies a legal gray area. Under Section 26 of the Indian Telegraph Act and right to privacy principles, recording conversations surreptitiously may be deemed inadmissible in court or a violation of privacy. However, courts sometimes accept recorded conversations as evidence if they are relevant to proving a crime and their authenticity is verified.',
    example: 'Meera recorded a conversation where her business partner admitted to hiding joint profits. While admissible as corroborative evidence in her fraud case, the partner claimed a breach of privacy, highlighting the importance of cautious recording.',
    readMoreUrl: 'https://indiankanoon.org/doc/1066060/',
    date: '3 days ago',
    quizQuestions: [
      {
        id: 'q4-1',
        question: 'Under what condition is an audio recording usually admissible as evidence in court?',
        options: [
          'It is always admissible, regardless of source',
          'The audio must be clear, relevant, and Section 65B electronic certificate must be provided',
          'It only needs to be sent via WhatsApp to the judge',
          'Only recordings made by police officers are admissible'
        ],
        correctAnswerIndex: 1,
        explanation: 'For electronic evidence like audio files, Section 65B of the Indian Evidence Act (now Section 63 of the Bharatiya Sakshya Adhiniyam - BSA) requires a specific certificate confirming the source and integrity of the device/file.',
        xpReward: 50
      }
    ]
  }
];
