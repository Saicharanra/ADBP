import {
  Employee,
  Dependent,
  Pensioner,
  MasterItem,
  CompetentAuthority,
  CardTemplate,
  ActivityLog,
  OperatorAccount
} from './types';

// Helper SVG generator for realistic mock photos
export function generateAvatarSvg(name: string, gender: string, bgHex = '1e3a8a'): string {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#${bgHex}" rx="12"/>
    <circle cx="100" cy="75" r="38" fill="#f8fafc" opacity="0.9"/>
    <path d="M 40 185 C 40 135, 160 135, 160 185 Z" fill="#f8fafc" opacity="0.9"/>
    <text x="100" y="85" font-family="sans-serif" font-size="28" font-weight="bold" fill="#${bgHex}" text-anchor="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Helper SVG generator for mock signatures
export function generateSignatureSvg(name: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="80" viewBox="0 0 250 80">
    <path d="M 20 50 Q 50 10 70 45 T 120 40 T 170 50 T 220 30" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
    <text x="30" y="68" font-family="cursive, Georgia, serif" font-size="20" font-style="italic" fill="#1e3a8a">${name}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// University Emblem SVG
export const UOH_LOGO_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#d97706" stroke-width="4"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,2"/>
  <path d="M 50 18 L 56 32 L 71 33 L 60 43 L 63 58 L 50 50 L 37 58 L 40 43 L 29 33 L 44 32 Z" fill="#d97706"/>
  <text x="50" y="74" font-family="serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">UOH 1974</text>
  <path d="M 30 82 Q 50 76 70 82" fill="none" stroke="#ffffff" stroke-width="2"/>
</svg>
`)}`;

// NAAC / Second emblem SVG
export const SECOND_LOGO_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="90" height="90" x="5" y="5" rx="10" fill="#047857" stroke="#fbbf24" stroke-width="3"/>
  <text x="50" y="38" font-family="sans-serif" font-size="14" font-weight="extrabold" fill="#ffffff" text-anchor="middle">NAAC</text>
  <text x="50" y="58" font-family="sans-serif" font-size="18" font-weight="black" fill="#fbbf24" text-anchor="middle">A++</text>
  <text x="50" y="76" font-family="sans-serif" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">GRADE INSTITUTION</text>
</svg>
`)}`;

export const initialDepartments: MasterItem[] = [
  { id: 'DEPT_01', name: 'School of Computer and Information Sciences', code: 'SCIS', status: 'Active' },
  { id: 'DEPT_02', name: 'School of Physics', code: 'PHYS', status: 'Active' },
  { id: 'DEPT_03', name: 'School of Chemistry', code: 'CHEM', status: 'Active' },
  { id: 'DEPT_04', name: 'School of Life Sciences', code: 'SLS', status: 'Active' },
  { id: 'DEPT_05', name: 'Administration & Estate Branch', code: 'ADMIN', status: 'Active' },
  { id: 'DEPT_06', name: 'Indira Gandhi Memorial Library', code: 'IGML', status: 'Active' },
  { id: 'DEPT_07', name: 'Health Centre & Medical Services', code: 'HCMS', status: 'Active' }
];

export const initialDesignations: MasterItem[] = [
  { id: 'DESG_01', name: 'Professor', status: 'Active' },
  { id: 'DESG_02', name: 'Associate Professor', status: 'Active' },
  { id: 'DESG_03', name: 'Assistant Professor', status: 'Active' },
  { id: 'DESG_04', name: 'Registrar', status: 'Active' },
  { id: 'DESG_05', name: 'Joint Registrar', status: 'Active' },
  { id: 'DESG_06', name: 'Assistant Registrar', status: 'Active' },
  { id: 'DESG_07', name: 'Technical Officer', status: 'Active' },
  { id: 'DESG_08', name: 'Senior Assistant', status: 'Active' },
  { id: 'DESG_09', name: 'Chief Medical Officer', status: 'Active' }
];

export const initialEmployees: Employee[] = [
  {
    id: '1001',
    name: 'Dr. Ramesh Chandra Sharma',
    type: 'Teaching',
    designation: 'Professor',
    department: 'School of Computer and Information Sciences',
    dob: '1975-04-12',
    doj: '2005-08-16',
    dor: '2040-04-30',
    gender: 'Male',
    presentAddress: 'Qtr No. C-14, South Campus, University of Hyderabad, Gachibowli, Hyderabad - 500046',
    permanentAddress: 'Plot 42, Green Avenue, Sector 5, RK Puram, New Delhi - 110022',
    contactNumber: '9849012345',
    altContactNumber: '040-23134000',
    bloodGroup: 'O+',
    photoUrl: generateAvatarSvg('Ramesh Sharma', 'Male', '1e3a8a'),
    signatureUrl: generateSignatureSvg('R.C. Sharma'),
    status: 'Active'
  },
  {
    id: '1002',
    name: 'Prof. Sunita Reddy',
    type: 'Teaching',
    designation: 'Associate Professor',
    department: 'School of Life Sciences',
    dob: '1980-11-25',
    doj: '2010-02-01',
    dor: '2045-11-30',
    gender: 'Female',
    presentAddress: 'Flat 302, Cyber Heights, Gachibowli, Hyderabad - 500032',
    permanentAddress: 'Flat 302, Cyber Heights, Gachibowli, Hyderabad - 500032',
    contactNumber: '9440198765',
    altContactNumber: '9848011223',
    bloodGroup: 'A+',
    photoUrl: generateAvatarSvg('Sunita Reddy', 'Female', '047857'),
    signatureUrl: generateSignatureSvg('Sunita Reddy'),
    status: 'Active'
  },
  {
    id: '1003',
    name: 'Sri K. Venkatraman',
    type: 'Non-Teaching',
    designation: 'Assistant Registrar',
    department: 'Administration & Estate Branch',
    dob: '1978-06-18',
    doj: '2008-11-10',
    dor: '2038-06-30',
    gender: 'Male',
    presentAddress: 'Qtr No. B-08, North Campus, University of Hyderabad, Hyderabad - 500046',
    permanentAddress: 'H.No 12-4-88, NGO Colony, Hanamkonda, Warangal - 506001',
    contactNumber: '9866543210',
    altContactNumber: '040-23132020',
    bloodGroup: 'B+',
    photoUrl: generateAvatarSvg('K Venkatraman', 'Male', 'b45309'),
    signatureUrl: generateSignatureSvg('K. Venkatraman'),
    status: 'Active'
  },
  {
    id: '1004',
    name: 'Smt. Ananya Mukherjee',
    type: 'Non-Teaching',
    designation: 'Technical Officer',
    department: 'School of Physics',
    dob: '1985-03-30',
    doj: '2014-06-01',
    dor: '2050-03-31',
    gender: 'Female',
    presentAddress: 'House 8-2-120, Jubilee Hills Road No 10, Hyderabad - 500033',
    permanentAddress: '45 Lake Gardens, 2nd Floor, Kolkata - 700045',
    contactNumber: '9701238901',
    altContactNumber: '9830011445',
    bloodGroup: 'AB+',
    photoUrl: generateAvatarSvg('Ananya Mukherjee', 'Female', '6b21a8'),
    signatureUrl: generateSignatureSvg('Ananya M.'),
    status: 'Active'
  },
  {
    id: '1005',
    name: 'Sri Mohammed Arif Khan',
    type: 'Non-Teaching',
    designation: 'Senior Assistant',
    department: 'Indira Gandhi Memorial Library',
    dob: '1988-09-14',
    doj: '2016-09-01',
    dor: '2053-09-30',
    gender: 'Male',
    presentAddress: 'Flat 104, Royal Apartments, Mehdipatnam, Hyderabad - 500028',
    permanentAddress: 'Flat 104, Royal Apartments, Mehdipatnam, Hyderabad - 500028',
    contactNumber: '9988776655',
    altContactNumber: '040-23132600',
    bloodGroup: 'O-',
    photoUrl: generateAvatarSvg('Mohammed Arif', 'Male', '0369a1'),
    signatureUrl: generateSignatureSvg('M.A. Khan'),
    status: 'Active'
  }
];

export const initialDependents: Dependent[] = [
  {
    id: '1001_01',
    employeeId: '1001',
    name: 'Smt. Sudha Sharma',
    dob: '1978-08-10',
    age: 48,
    gender: 'Female',
    relationship: 'Spouse',
    bloodGroup: 'O+',
    photoUrl: generateAvatarSvg('Sudha Sharma', 'Female', 'be185d'),
    status: 'Active'
  },
  {
    id: '1001_02',
    employeeId: '1001',
    name: 'Master Aarav Sharma',
    dob: '2012-05-14',
    age: 14,
    gender: 'Male',
    relationship: 'Son',
    bloodGroup: 'O+',
    photoUrl: generateAvatarSvg('Aarav Sharma', 'Male', '0284c7'),
    status: 'Active'
  },
  {
    id: '1001_03',
    employeeId: '1001',
    name: 'Kumari Ananya Sharma',
    dob: '2016-10-20',
    age: 10,
    gender: 'Female',
    relationship: 'Daughter',
    bloodGroup: 'A+',
    photoUrl: generateAvatarSvg('Ananya Sharma', 'Female', 'd946ef'),
    status: 'Active'
  },
  {
    id: '1002_01',
    employeeId: '1002',
    name: 'Sri Dr. V. Rajagopal',
    dob: '1977-01-15',
    age: 49,
    gender: 'Male',
    relationship: 'Spouse',
    bloodGroup: 'B+',
    photoUrl: generateAvatarSvg('V Rajagopal', 'Male', '15803d'),
    status: 'Active'
  },
  {
    id: '1003_01',
    employeeId: '1003',
    name: 'Smt. K. Lakshmi',
    dob: '1982-04-05',
    age: 44,
    gender: 'Female',
    relationship: 'Spouse',
    bloodGroup: 'B+',
    photoUrl: generateAvatarSvg('K Lakshmi', 'Female', 'c026d3'),
    status: 'Active'
  },
  {
    id: '1003_02',
    employeeId: '1003',
    name: 'Sri K. Ramakrishna',
    dob: '1950-12-10',
    age: 75,
    gender: 'Male',
    relationship: 'Father',
    bloodGroup: 'O+',
    photoUrl: generateAvatarSvg('K Ramakrishna', 'Male', '475569'),
    status: 'Active'
  }
];

export const initialPensioners: Pensioner[] = [
  {
    id: '9001',
    name: 'Prof. B. J. Rao (Retd.)',
    type: 'Teaching',
    lastDesignation: 'Professor & Dean',
    lastDepartment: 'School of Life Sciences',
    dob: '1959-07-20',
    doj: '1989-08-01',
    dateOfRetirement: '2024-07-31',
    pensionOrderNo: 'PPO/UOH/2024/089',
    pensionPayOrder: 'PPO/UOH/2024/089',
    gender: 'Male',
    address: 'Plot 102, Senior Citizens Colony, Jubilee Hills, Hyderabad - 500033',
    contactNumber: '9849911223',
    bloodGroup: 'AB+',
    photoUrl: generateAvatarSvg('BJ Rao', 'Male', '334155'),
    signatureUrl: generateSignatureSvg('B.J. Rao'),
    status: 'Active'
  },
  {
    id: '9002',
    name: 'Smt. Pushpa Latha (Retd.)',
    type: 'Non-Teaching',
    lastDesignation: 'Joint Registrar',
    lastDepartment: 'Administration & Estate Branch',
    dob: '1961-02-14',
    doj: '1986-04-15',
    dateOfRetirement: '2026-02-28',
    pensionOrderNo: 'PPO/UOH/2026/014',
    pensionPayOrder: 'PPO/UOH/2026/014',
    gender: 'Female',
    address: 'H.No 3-4-567, Barkatpura, Hyderabad - 500027',
    contactNumber: '9440012399',
    bloodGroup: 'O+',
    photoUrl: generateAvatarSvg('Pushpa Latha', 'Female', '475569'),
    signatureUrl: generateSignatureSvg('Pushpa Latha'),
    status: 'Active'
  }
];

export const initialAuthorities: CompetentAuthority[] = [
  {
    id: 'AUTH_01',
    type: 'Vice-Chancellor',
    employeeId: 'VC_01',
    name: 'Prof. Basuthkar Jagadeeshwar Rao',
    photoUrl: generateAvatarSvg('BJ Rao', 'Male', '1e3a8a'),
    signatureUrl: generateSignatureSvg('B.J. Rao (VC)'),
    effectiveFrom: '2021-07-26',
    orderNo: 'F.No. UoH/VC/Ord/2021/01',
    remarks: 'Appointed as Vice-Chancellor by the Visitor of the University.'
  },
  {
    id: 'AUTH_02',
    type: 'Registrar',
    employeeId: 'REG_01',
    name: 'Dr. Devesh Nigam',
    photoUrl: generateAvatarSvg('Devesh Nigam', 'Male', '047857'),
    signatureUrl: generateSignatureSvg('Devesh Nigam (Reg)'),
    effectiveFrom: '2022-03-15',
    orderNo: 'F.No. UoH/Reg/Appt/2022/45',
    remarks: 'Appointed as Registrar, University of Hyderabad.'
  }
];

export const initialCardTemplates: CardTemplate[] = [
  {
    id: 'TMPL_ID_CARD',
    cardType: 'ID Card',
    widthMm: 85.6,
    heightMm: 53.98,
    thickness: '0.76mm / 30 mil CR-80 Standard',
    orientation: 'landscape',
    numberOfLogos: 2,
    logoAlignment: 'split',
    secondLogoType: 'naac',
    headerLines: ['UNIVERSITY OF HYDERABAD', 'Gachibowli, Hyderabad - 500046, Telangana'],
    hasHeaderDivider: true,
    titleText: 'EMPLOYEE IDENTITY CARD',
    titleFont: 'sans-serif',
    titleSize: 11,
    titleAlignment: 'center',
    headerBgColor: '#1e3a8a',
    headerTextColor: '#ffffff',
    cardBgColor: '#ffffff',
    accentColor: '#d97706',
    frontFields: {
      photo: true,
      name: true,
      designation: true,
      department: true,
      employeeId: true,
      dob: true,
      doj: true,
      bloodGroup: true,
      contactNumber: true,
      emergencyContact: false,
      qrCode: true,
      signature: true
    },
    backFields: {
      presentAddress: true,
      permanentAddress: true,
      authoritySignature: true,
      instructions: true,
      qrCode: false,
      dependentsGrid: false
    },
    photoWidth: 80,
    photoHeight: 95,
    photoPosition: 'left',
    signatureWidth: 100,
    signatureHeight: 35,
    qrSize: 65,
    qrPosition: 'bottom-right',
    instructions: [
      '1. This card is non-transferable and must be produced on demand by campus security.',
      '2. Loss of this card must be reported immediately to the issuing authority / CC.',
      '3. Found cards should be returned to Computer Centre / CNF, University of Hyderabad.',
      '4. Valid across all University gates, libraries, labs, and administrative departments.'
    ]
  },
  {
    id: 'TMPL_HEALTH_CARD',
    cardType: 'Health Card',
    widthMm: 85.6,
    heightMm: 53.98,
    thickness: '0.76mm / 30 mil CR-80 Standard',
    orientation: 'landscape',
    numberOfLogos: 2,
    logoAlignment: 'split',
    secondLogoType: 'emblem',
    headerLines: ['UNIVERSITY OF HYDERABAD MEDICAL SCHEME', 'Health Centre, Gachibowli, Hyderabad'],
    hasHeaderDivider: true,
    titleText: 'FAMILY HEALTH PASS',
    titleFont: 'sans-serif',
    titleSize: 11,
    titleAlignment: 'center',
    headerBgColor: '#047857',
    headerTextColor: '#ffffff',
    cardBgColor: '#f0fdf4',
    accentColor: '#059669',
    frontFields: {
      photo: true,
      name: true,
      designation: true,
      department: true,
      employeeId: true,
      dob: false,
      doj: false,
      bloodGroup: true,
      contactNumber: true,
      emergencyContact: true,
      qrCode: true,
      signature: true
    },
    backFields: {
      presentAddress: false,
      permanentAddress: false,
      authoritySignature: true,
      instructions: false,
      qrCode: false,
      dependentsGrid: true
    },
    photoWidth: 75,
    photoHeight: 90,
    photoPosition: 'left',
    signatureWidth: 90,
    signatureHeight: 30,
    qrSize: 60,
    qrPosition: 'bottom-right',
    instructions: [
      '1. Card must be presented at UoH Health Centre and empaneled hospitals.',
      '2. Medical benefits apply to valid registered dependents listed on the back.',
      '3. Misuse of health card is subject to strict disciplinary proceedings.',
      '4. Emergency helpline: 040-23132400 / Health Centre Desk.'
    ]
  },
  {
    id: 'TMPL_PENSIONER_CARD',
    cardType: 'Pensioner Card',
    widthMm: 85.6,
    heightMm: 53.98,
    thickness: '0.76mm / 30 mil CR-80 Standard',
    orientation: 'landscape',
    numberOfLogos: 2,
    logoAlignment: 'split',
    secondLogoType: 'naac',
    headerLines: ['UNIVERSITY OF HYDERABAD', 'Pensioners Cell, Gachibowli, Hyderabad'],
    hasHeaderDivider: true,
    titleText: 'PENSIONER IDENTITY CARD',
    titleFont: 'sans-serif',
    titleSize: 11,
    titleAlignment: 'center',
    headerBgColor: '#4338ca',
    headerTextColor: '#ffffff',
    cardBgColor: '#faf5ff',
    accentColor: '#6366f1',
    frontFields: {
      photo: true,
      name: true,
      designation: true,
      department: true,
      employeeId: true,
      dob: true,
      doj: false,
      bloodGroup: true,
      contactNumber: true,
      emergencyContact: false,
      qrCode: true,
      signature: true
    },
    backFields: {
      presentAddress: true,
      permanentAddress: false,
      authoritySignature: true,
      instructions: true,
      qrCode: false,
      dependentsGrid: false
    },
    photoWidth: 80,
    photoHeight: 95,
    photoPosition: 'left',
    signatureWidth: 95,
    signatureHeight: 32,
    qrSize: 65,
    qrPosition: 'bottom-right',
    instructions: [
      '1. Serves as official pensioner identity for University & Banking purposes.',
      '2. Life certificate submission required annually as per GOI norms.',
      '3. Return of lost card requested to Pensioners Cell, Admin Building, UoH.',
      '4. Contact Pension Branch: 040-23132100 for queries.'
    ]
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'LOG_01',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    username: 'admin',
    role: 'admin',
    action: 'SYSTEM_INIT',
    details: 'Initial ADPS Demo data seeded with 5 mock employees and templates.'
  },
  {
    id: 'LOG_02',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    username: 'admin',
    role: 'admin',
    action: 'UPDATE_AUTHORITY',
    details: 'Updated Vice-Chancellor competent authority record.'
  },
  {
    id: 'LOG_03',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    username: 'operator1',
    role: 'operator',
    action: 'CARD_GENERATED',
    details: 'Generated ID Card for Employee ID 1001 (Dr. Ramesh Chandra Sharma).'
  }
];

export const initialOperators: OperatorAccount[] = [
  {
    id: 'OP_01',
    employeeId: '1003',
    username: '1003',
    name: 'Sri K. Venkatraman',
    createdAt: '2026-01-10',
    status: 'Active'
  },
  {
    id: 'OP_02',
    employeeId: '1005',
    username: '1005',
    name: 'Sri Mohammed Arif Khan',
    createdAt: '2026-02-01',
    status: 'Active'
  }
];
