import type { GovernmentResource } from '../types/legal';

export const mockResources: GovernmentResource[] = [
  {
    id: 'res-cyber',
    name: 'National Cyber Crime Reporting Portal',
    purpose: 'Report all types of financial cyber frauds, hacking, identity theft, and online harassment directly to cyber cells.',
    authority: 'Ministry of Home Affairs, Government of India',
    url: 'https://cybercrime.gov.in',
    category: 'Cyber Crime'
  },
  {
    id: 'res-consumer-nch',
    name: 'National Consumer Helpline (NCH)',
    purpose: 'File grievances against sellers or service providers for defective goods, incorrect billing, or poor service support.',
    authority: 'Department of Consumer Affairs, Government of India',
    url: 'https://consumerhelpline.gov.in',
    category: 'Consumer'
  },
  {
    id: 'res-edaakhil',
    name: 'E-Daakhil Portal',
    purpose: 'File consumer cases online directly in district, state, or national commissions, including online fee payments and documents upload.',
    authority: 'National Consumer Disputes Redressal Commission (NCDRC)',
    url: 'https://edaakhil.nic.in',
    category: 'Consumer'
  },
  {
    id: 'res-nalsa',
    name: 'NALSA Free Legal Services',
    purpose: 'Request a free legal aid advocate or legal advice if you are eligible under the Legal Services Authorities Act.',
    authority: 'National Legal Services Authority',
    url: 'https://nalsa.gov.in',
    category: 'Legal Aid'
  },
  {
    id: 'res-rti-online',
    name: 'RTI Online Portal',
    purpose: 'File Right to Information applications online to any Central Government department or public authority.',
    authority: 'Department of Personnel and Training',
    url: 'https://rtionline.gov.in',
    category: 'RTI'
  },
  {
    id: 'res-mparivahan',
    name: 'NextGen mParivahan',
    purpose: 'Verify license details, check vehicle registrations, and pay pending traffic e-challans online.',
    authority: 'Ministry of Road Transport and Highways',
    url: 'https://echallan.parivahan.gov.in',
    category: 'Transport'
  },
  {
    id: 'res-ncw',
    name: 'National Commission for Women',
    purpose: 'Register complaints regarding violence, harassment, or deprivation of rights faced by women.',
    authority: 'NCW India',
    url: 'http://ncw.nic.in',
    category: 'Women\'s Services'
  },
  {
    id: 'res-digilocker',
    name: 'DigiLocker Portal',
    purpose: 'Access digitally verified government certificates like Driving License, vehicle RC, and Aadhaar, which are legally valid.',
    authority: 'Ministry of Electronics and Information Technology',
    url: 'https://www.digilocker.gov.in',
    category: 'Citizen Services'
  }
];
export const mockResourceCategories = [
  'All',
  'Police',
  'Cyber Crime',
  'Consumer',
  'RTI',
  'Transport',
  'Legal Aid',
  'Women\'s Services',
  'Citizen Services'
];
