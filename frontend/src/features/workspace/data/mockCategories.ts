import type { LawCategory } from '../types/legal';

export const mockCategories: LawCategory[] = [
  {
    id: 'police-rights',
    name: 'Police Rights',
    icon: 'Shield',
    description: 'Learn your rights during arrest, detentions, searches, and procedures for filing an FIR.',
    articleCount: 12,
    articles: [
      {
        id: 'pr-a1',
        title: 'Right to know grounds of arrest',
        section: 'Section 50 CrPC (now Section 47 BNSS)',
        description: 'Every person arrested without a warrant has the right to be informed immediately of the full particulars of the offence or other grounds for their arrest.'
      },
      {
        id: 'pr-a2',
        title: 'Production before Magistrate within 24 hours',
        section: 'Section 57 CrPC (now Section 58 BNSS)',
        description: 'An arrested person must be produced before the nearest judicial magistrate within 24 hours of arrest, excluding travel time.'
      },
      {
        id: 'pr-a3',
        title: 'Right to consult a lawyer during interrogation',
        section: 'Section 41D CrPC (now Section 35(3) BNSS)',
        description: 'An arrested person has the right to meet an advocate of their choice during interrogation, though not throughout the interrogation.'
      }
    ]
  },
  {
    id: 'traffic',
    name: 'Traffic',
    icon: 'Car',
    description: 'Understand traffic violations, document rules, and spot-fine procedures on Indian roads.',
    articleCount: 8,
    articles: [
      {
        id: 'tf-a1',
        title: 'Digital Documents Validity',
        section: 'Rule 139 of Central Motor Vehicles Rules',
        description: 'Showing vehicle documents (DL, RC, Insurance, PUC) through government apps like DigiLocker or mParivahan is legally equivalent to carrying physical documents.'
      },
      {
        id: 'tf-a2',
        title: 'Breathalyzer Test Protocol',
        section: 'Section 185 of Motor Vehicles Act',
        description: 'If driving under the influence is suspected, you must submit to a breathalyzer test. An alcohol level exceeding 30mg per 100ml of blood is a fineable offense.'
      }
    ]
  },
  {
    id: 'consumer',
    name: 'Consumer',
    icon: 'ShoppingBag',
    description: 'Protect yourself against defective products, adulteration, and misleading advertisements.',
    articleCount: 15,
    articles: [
      {
        id: 'cs-a1',
        title: 'Right to safety and choice',
        section: 'Section 9 of Consumer Protection Act, 2019',
        description: 'Consumers have the right to be protected against marketing of goods hazardous to life, and the right to be assured access to a variety of goods at competitive prices.'
      },
      {
        id: 'cs-a2',
        title: 'Product Liability rules',
        section: 'Chapter VI of Consumer Protection Act, 2019',
        description: 'Allows consumers to claim compensation from a product manufacturer or seller for any harm caused due to a defective product.'
      }
    ]
  },
  {
    id: 'cyber',
    name: 'Cyber',
    icon: 'Laptop',
    description: 'Guidelines on online banking frauds, identity theft, cyberstalking, and hacking.',
    articleCount: 10,
    articles: [
      {
        id: 'cb-a1',
        title: 'Penalty for Identity Theft',
        section: 'Section 66C of Information Technology Act',
        description: 'Anyone who fraudulently uses the electronic signature, password, or unique identification feature of another is punishable with up to 3 years imprisonment.'
      },
      {
        id: 'cb-a2',
        title: 'Punishment for Cyberstalking',
        section: 'Section 354D of Indian Penal Code',
        description: 'Any man who monitors the use by a woman of the internet, email, or other electronic communication commits the offence of stalking.'
      }
    ]
  },
  {
    id: 'employment',
    name: 'Employment',
    icon: 'Briefcase',
    description: 'Understand working hours, gratuity, wrongful terminations, and minimum wage rules.',
    articleCount: 11,
    articles: [
      {
        id: 'ep-a1',
        title: 'Maternity Benefit rights',
        section: 'Section 5 of Maternity Benefit Act, 1961',
        description: 'Every woman is entitled to 26 weeks of paid maternity leave, with at least 8 weeks preceding the expected delivery date.'
      }
    ]
  },
  {
    id: 'women',
    name: 'Women',
    icon: 'HeartHandshake',
    description: 'Rights regarding sexual harassment (POSH), inheritance, maintenance, and domestic safety.',
    articleCount: 14,
    articles: [
      {
        id: 'wm-a1',
        title: 'Prevention of Sexual Harassment (POSH)',
        section: 'POSH Act, 2013',
        description: 'Every workplace with 10 or more employees must constitute an Internal Complaints Committee (ICC) to address complaints of sexual harassment.'
      }
    ]
  },
  {
    id: 'property',
    name: 'Property',
    icon: 'Home',
    description: 'Rules for sale agreements, stamp duties, succession, and registered rentals.',
    articleCount: 9,
    articles: []
  },
  {
    id: 'family',
    name: 'Family',
    icon: 'Users',
    description: 'Marriage laws, divorce procedures, child custody, and maintenance regulations.',
    articleCount: 13,
    articles: []
  },
  {
    id: 'student',
    name: 'Student',
    icon: 'BookOpen',
    description: 'Anti-ragging guidelines, right to education (RTE), and educational disputes.',
    articleCount: 7,
    articles: []
  },
  {
    id: 'banking',
    name: 'Banking',
    icon: 'CreditCard',
    description: 'Lending standards, credit card rules, and Banking Ombudsman grievances.',
    articleCount: 8,
    articles: []
  },
  {
    id: 'tax',
    name: 'Tax',
    icon: 'DollarSign',
    description: 'Income tax slabs, deductions, filing rules, and GST basics for consumers.',
    articleCount: 6,
    articles: []
  },
  {
    id: 'digital-privacy',
    name: 'Digital Privacy',
    icon: 'Key',
    description: 'Understanding the newly enacted Digital Personal Data Protection (DPDP) Act.',
    articleCount: 5,
    articles: [
      {
        id: 'dp-a1',
        title: 'Consent-based Data Processing',
        section: 'Section 6 of DPDP Act, 2023',
        description: 'Personal data can only be processed with clear, specific, unconditional, and unambiguous consent given by the individual.'
      }
    ]
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: 'Leaf',
    description: 'Pollution control, forest acts, and National Green Tribunal (NGT) filings.',
    articleCount: 6,
    articles: []
  },
  {
    id: 'constitutional-rights',
    name: 'Constitutional Rights',
    icon: 'BookOpen',
    description: 'Fundamental rights under Part III of the Constitution and writ remedies.',
    articleCount: 12,
    articles: [
      {
        id: 'cr-a1',
        title: 'Right to Constitutional Remedies',
        section: 'Article 32 of Indian Constitution',
        description: 'Allows individuals to petition the Supreme Court directly for the enforcement of fundamental rights via writs like Habeas Corpus or Mandamus.'
      }
    ]
  }
];
