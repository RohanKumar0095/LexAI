import type { Scenario } from '../types/legal';

export const mockScenarios: Scenario[] = [
  {
    id: 'police-stop',
    title: 'Police Stop',
    icon: 'Shield',
    description: 'Understand your rights and stay calm if you are stopped by police officers on the street or in your vehicle.',
    steps: [
      {
        stepNumber: 1,
        title: 'Remain Calm & Park Safely',
        description: 'Pull over to the side of the road safely. Turn off the ignition, turn on the cabin light if it is night, and keep your hands visible on the steering wheel/handlebars.',
        details: 'Do not panic or attempt to accelerate away. Cooperating visually reduces tension immediately.'
      },
      {
        stepNumber: 2,
        title: 'Present Required Documents',
        description: 'If driving a vehicle, you are legally obligated to show your Driving License, Registration Certificate (RC), Insurance Document, and Pollution Under Control (PUC) certificate.',
        details: 'You can show physical copies or digital ones via government apps like DigiLocker or mParivahan; these are legally valid.'
      },
      {
        stepNumber: 3,
        title: 'Know Search Limitations',
        description: 'An officer can check your vehicle documents, but a search of your body or vehicle trunk requires reasonable suspicion of an offense or a warrant.',
        details: 'If a search is demanded, politely ask for the reason. If it is a female citizen, any physical search must only be conducted by a female police officer after sunrise and before sunset.'
      },
      {
        stepNumber: 4,
        title: 'Challan Protocol',
        description: 'If you have committed a traffic violation, the officer must issue an official e-challan or paper receipt showing the fine amount and violation section.',
        details: 'Only officers of Sub-Inspector rank (one star) or above can issue on-spot fines. Constables can only assist.'
      }
    ]
  },
  {
    id: 'road-accident',
    title: 'Road Accident',
    icon: 'Car',
    description: 'Learn the legal steps to protect yourself and help others in case of a vehicular collision.',
    steps: [
      {
        stepNumber: 1,
        title: 'Ensure Safety and Medical Aid',
        description: 'Stop the vehicle. Assess injuries. Under Section 134 of the Motor Vehicles Act, you must provide medical help to any injured person immediately.',
        details: 'The "Good Samaritan Law" protects you from harassment if you take an injured person to the hospital.'
      },
      {
        stepNumber: 2,
        title: 'Document the Scene',
        description: 'Take photographs and videos of the vehicle positions, damage, registration numbers, and road conditions.',
        details: 'Collect contact details of any eyewitnesses who saw what happened.'
      },
      {
        stepNumber: 3,
        title: 'Inform Authorities & Insurance',
        description: 'Call the police helpline (112) to report the accident. Inform your vehicle insurance provider within the required timeline.',
        details: 'An FIR or Police GD entry is necessary to claim insurance coverage or make third-party claims.'
      }
    ]
  },
  {
    id: 'cyber-fraud',
    title: 'Cyber Fraud',
    icon: 'Laptop',
    description: 'Get step-by-step guidance on what to do if you have lost money to online scams, phishing, or identity theft.',
    steps: [
      {
        stepNumber: 1,
        title: 'Block Accounts Immediately',
        description: 'Call your bank or card issuer immediately to block your cards, UPI handles, and net banking access.',
        details: 'This prevents fraudsters from taking more funds.'
      },
      {
        stepNumber: 2,
        title: 'Call 1930 Helpline',
        description: 'Dial 1930 immediately. It connects to the National Cyber Crime Portal operators who work with banks to freeze transactions.',
        details: 'Calling within 1-2 hours increases chances of reversing the transfer.'
      },
      {
        stepNumber: 3,
        title: 'Register Complaint Online',
        description: 'File an official report on www.cybercrime.gov.in with screenshots of bank alerts, links, and caller details.',
        details: 'The portal routes the complaint to your local district cyber crime cell.'
      }
    ]
  },
  {
    id: 'domestic-violence',
    title: 'Domestic Violence',
    icon: 'HeartHandshake',
    description: 'Understand the protective legal channels for women facing physical, emotional, or economic abuse within the household.',
    steps: [
      {
        stepNumber: 1,
        title: 'Ensure Immediate Safety',
        description: 'If you are in immediate danger, lock yourself in a secure room or call the emergency response number (112) or the dedicated Women\'s Helpline (1091).',
        details: 'Contact trusted relatives or neighbors to inform them of your situation.'
      },
      {
        stepNumber: 2,
        title: 'Collect & Secure Evidence',
        description: 'Document physical injuries (photos), save threatening texts, emails, voice recordings, and obtain medical certificates from a doctor if treated.',
        details: 'Secure your critical documents (ID proofs, marriage certificate, financial records) in a safe place.'
      },
      {
        stepNumber: 3,
        title: 'Reach out to Protection Officers',
        description: 'Under the Protection of Women from Domestic Violence Act, 2005, you can contact a Protection Officer (appointed by state govts) or file a complaint directly in court.',
        details: 'Courts can grant protection orders, residence orders, and monetary relief within 60 days.'
      }
    ]
  },
  {
    id: 'consumer-complaint',
    title: 'Consumer Complaint',
    icon: 'ShoppingBag',
    description: 'Know how to resolve disputes with brands, e-commerce stores, or local services regarding defective products.',
    steps: [
      {
        stepNumber: 1,
        title: 'Send a Formal Grievance',
        description: 'Write an email or customer support ticket detailing the product defect, purchase invoice, and your clear demand for refund/replacement.',
        details: 'Grievance logs are essential evidence for court.'
      },
      {
        stepNumber: 2,
        title: 'National Consumer Helpline',
        description: 'File an informal grievance on consumerhelpline.gov.in (or call 1915). NCH works with registered brands to settle disputes out of court.',
        details: 'Many companies resolve complaints here to maintain their ratings.'
      },
      {
        stepNumber: 3,
        title: 'File on E-Daakhil Portal',
        description: 'If unresolved, register a case on edaakhil.nic.in. You can submit documents and pay court fees online without visiting the Consumer Commission.',
        details: 'You do not strictly need a lawyer to file or argue your case in Consumer Commissions.'
      }
    ]
  },
  {
    id: 'tenant-issues',
    title: 'Tenant Issues',
    icon: 'Home',
    description: 'Learn your rights concerning rent increments, eviction notices, security deposits, and basic utility access.',
    steps: [
      {
        stepNumber: 1,
        title: 'Review the Rent Agreement',
        description: 'Check notice periods, deposit refund terms, and rent increment clauses in your signed agreement.',
        details: 'Verbally agreed terms are very difficult to enforce.'
      },
      {
        stepNumber: 2,
        title: 'Address Utility Disconnection',
        description: 'If the landlord cuts off basic utilities (water, electricity) to force eviction, it is illegal under Rent Control Acts.',
        details: 'You can immediately approach the local Rent Controller or Civil Judge for a restoration order.'
      },
      {
        stepNumber: 3,
        title: 'Reply to Eviction Notices',
        description: 'If served an eviction notice, reply in writing disputing the grounds if they are false or violate the agreed notice period.',
        details: 'Keep a copy of your speed post receipt as proof of dispatch.'
      }
    ]
  },
  {
    id: 'salary-dispute',
    title: 'Salary Dispute',
    icon: 'Briefcase',
    description: 'Understand the legal remedies for delayed payments, wrongful termination, or breach of employment contracts.',
    steps: [
      {
        stepNumber: 1,
        title: 'Review Employment Contract',
        description: 'Examine clauses on payment terms, severance package, notice period, and termination procedures.',
        details: 'Ensure you have copies of your offer letter, salary slips, and bank statements.'
      },
      {
        stepNumber: 2,
        title: 'Submit Written Representation',
        description: 'Send a formal email to HR and Senior Management demanding outstanding salary and requesting a written explanation for the delay/non-payment.',
        details: 'Always maintain communication in writing (avoid phone calls or verbal promises without email follow-up).'
      },
      {
        stepNumber: 3,
        title: 'Labor Commissioner or Civil Court',
        description: 'Under the Payment of Wages Act, 1936, or Industrial Disputes Act, you can file a complaint with the regional Labor Commissioner.',
        details: 'For white-collar employees, a civil suit for recovery of money or a demand notice under the Insolvency and Bankruptcy Code (IBC) can be sent.'
      }
    ]
  }
];
