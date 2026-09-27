export type Role = 'admin' | 'operator';

export interface UserSession {
  username: string;
  role: Role;
  name: string;
  employeeId?: string;
}

export type EmployeeType = 'Teaching' | 'Non-Teaching';
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface Employee {
  id: string; // 4-digit unique string e.g. "1001"
  name: string;
  type: EmployeeType;
  designation: string;
  department: string;
  dob: string;
  doj: string;
  dor?: string;
  gender: Gender;
  presentAddress: string;
  permanentAddress: string;
  contactNumber: string;
  altContactNumber?: string;
  bloodGroup: BloodGroup;
  photoUrl: string;
  signatureUrl: string;
  status: 'Active' | 'Retired' | 'In-Active';
}

export type DependentRelationship = 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Other';

export interface Dependent {
  id: string; // e.g. "1001_01"
  employeeId: string;
  name: string;
  dob: string;
  age?: number;
  gender: Gender;
  relationship: DependentRelationship;
  bloodGroup: BloodGroup;
  photoUrl: string;
  status: 'Active' | 'In-Active';
}

export interface Pensioner {
  id: string; // same as former employeeId
  name: string;
  type: EmployeeType;
  lastDesignation: string;
  lastDepartment: string;
  dob: string;
  doj: string;
  dateOfRetirement: string;
  pensionOrderNo: string;
  pensionPayOrder?: string;
  gender: Gender;
  address: string;
  contactNumber: string;
  bloodGroup: BloodGroup;
  photoUrl: string;
  signatureUrl: string;
  status: 'Active' | 'In-Active';
}

export interface MasterItem {
  id: string;
  name: string;
  code?: string;
  status: 'Active' | 'In-Active';
}

export type AuthorityType = 'Vice-Chancellor' | 'Registrar';

export interface CompetentAuthority {
  id: string;
  type: AuthorityType;
  employeeId: string;
  name: string;
  photoUrl: string;
  signatureUrl: string;
  effectiveFrom: string;
  orderNo: string;
  remarks: string;
}

export type CardType = 'ID Card' | 'Health Card' | 'Pensioner Card';

export interface CardTemplate {
  id: string;
  cardType: CardType;
  widthMm: number; // default 85.6
  heightMm: number; // default 53.98
  thickness: string; // e.g. "0.76mm / 30 mil"
  orientation: 'landscape' | 'portrait';
  numberOfLogos: 1 | 2;
  logoAlignment: 'left' | 'center' | 'split' | 'right';
  secondLogoType?: 'emblem' | 'naac' | 'azadi';
  headerLines: string[];
  hasHeaderDivider: boolean;
  titleText: string;
  titleFont: string;
  titleSize: number; // in pt/px
  titleAlignment: 'left' | 'center' | 'right';
  headerBgColor: string;
  headerTextColor: string;
  cardBgColor: string;
  accentColor: string;
  
  // Field visibilities
  frontFields: {
    photo: boolean;
    name: boolean;
    designation: boolean;
    department: boolean;
    employeeId: boolean;
    dob: boolean;
    doj: boolean;
    bloodGroup: boolean;
    contactNumber: boolean;
    emergencyContact: boolean;
    qrCode: boolean;
    signature: boolean;
  };
  backFields: {
    presentAddress: boolean;
    permanentAddress: boolean;
    authoritySignature: boolean;
    instructions: boolean;
    qrCode: boolean;
    dependentsGrid: boolean; // Crucial for Health Card
  };
  
  // Sizes and positions
  photoWidth: number; // px
  photoHeight: number; // px
  photoPosition: 'left' | 'center' | 'right';
  signatureWidth: number;
  signatureHeight: number;
  qrSize: number;
  qrPosition: 'left' | 'center' | 'right' | 'bottom-right' | 'bottom-left';
  
  // Custom text
  instructions: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  username: string;
  role: Role;
  action: string;
  details: string;
}

export interface OperatorAccount {
  id: string;
  employeeId: string;
  username: string;
  name: string;
  createdAt: string;
  status: 'Active' | 'In-Active';
}
