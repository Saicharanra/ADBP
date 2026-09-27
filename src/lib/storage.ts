import {
  Employee,
  Dependent,
  Pensioner,
  MasterItem,
  CompetentAuthority,
  CardTemplate,
  ActivityLog,
  OperatorAccount,
  UserSession,
  CardType
} from './types';
import {
  initialEmployees,
  initialDependents,
  initialPensioners,
  initialDepartments,
  initialDesignations,
  initialAuthorities,
  initialCardTemplates,
  initialActivityLogs,
  initialOperators
} from './mockData';

const KEYS = {
  EMPLOYEES: 'adps_employees',
  DEPENDENTS: 'adps_dependents',
  PENSIONERS: 'adps_pensioners',
  DEPARTMENTS: 'adps_departments',
  DESIGNATIONS: 'adps_designations',
  AUTHORITIES: 'adps_authorities',
  TEMPLATES: 'adps_templates',
  LOGS: 'adps_logs',
  OPERATORS: 'adps_operators',
  SESSION: 'adps_session'
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getItem<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading key ${key}:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('adps-storage-update', { detail: { key } }));
  } catch (err) {
    console.error(`Error setting key ${key}:`, err);
  }
}

export function initializeStorage(forceReset = false): void {
  if (!isClient()) return;

  if (forceReset || !localStorage.getItem(KEYS.EMPLOYEES)) {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(initialEmployees));
  }
  if (forceReset || !localStorage.getItem(KEYS.DEPENDENTS)) {
    localStorage.setItem(KEYS.DEPENDENTS, JSON.stringify(initialDependents));
  }
  if (forceReset || !localStorage.getItem(KEYS.PENSIONERS)) {
    localStorage.setItem(KEYS.PENSIONERS, JSON.stringify(initialPensioners));
  }
  if (forceReset || !localStorage.getItem(KEYS.DEPARTMENTS)) {
    localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(initialDepartments));
  }
  if (forceReset || !localStorage.getItem(KEYS.DESIGNATIONS)) {
    localStorage.setItem(KEYS.DESIGNATIONS, JSON.stringify(initialDesignations));
  }
  if (forceReset || !localStorage.getItem(KEYS.AUTHORITIES)) {
    localStorage.setItem(KEYS.AUTHORITIES, JSON.stringify(initialAuthorities));
  }
  if (forceReset || !localStorage.getItem(KEYS.TEMPLATES)) {
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(initialCardTemplates));
  }
  if (forceReset || !localStorage.getItem(KEYS.LOGS)) {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(initialActivityLogs));
  }
  if (forceReset || !localStorage.getItem(KEYS.OPERATORS)) {
    localStorage.setItem(KEYS.OPERATORS, JSON.stringify(initialOperators));
  }

  if (forceReset) {
    window.dispatchEvent(new CustomEvent('adps-storage-update', { detail: { key: 'ALL' } }));
  }
}

// Session Management
export function getSession(): UserSession | null {
  return getItem<UserSession | null>(KEYS.SESSION, null);
}

export function setSession(session: UserSession): void {
  setItem(KEYS.SESSION, session);
  addActivityLog(`User logged in as ${session.role} (${session.username})`);
}

export function clearSession(): void {
  const current = getSession();
  if (current) {
    addActivityLog(`User logged out (${current.username})`);
  }
  if (isClient()) {
    localStorage.removeItem(KEYS.SESSION);
    window.dispatchEvent(new CustomEvent('adps-storage-update', { detail: { key: KEYS.SESSION } }));
  }
}

// Employees
export function getEmployees(): Employee[] {
  initializeStorage();
  return getItem<Employee[]>(KEYS.EMPLOYEES, initialEmployees);
}

export function getEmployeeById(id: string): Employee | undefined {
  return getEmployees().find(e => e.id === id);
}

export function saveEmployee(employee: Employee): void {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === employee.id);
  if (index >= 0) {
    employees[index] = employee;
    addActivityLog(`Updated employee ${employee.id} (${employee.name})`);
  } else {
    employees.push(employee);
    addActivityLog(`Created new employee ${employee.id} (${employee.name})`);
  }
  setItem(KEYS.EMPLOYEES, employees);
}

export function deleteEmployee(id: string): void {
  const employees = getEmployees().filter(e => e.id !== id);
  setItem(KEYS.EMPLOYEES, employees);
  addActivityLog(`Deleted employee ID ${id}`);
}

// Dependents
export function getDependents(): Dependent[] {
  initializeStorage();
  return getItem<Dependent[]>(KEYS.DEPENDENTS, initialDependents);
}

export function getDependentsForEmployee(employeeId: string): Dependent[] {
  return getDependents().filter(d => d.employeeId === employeeId);
}

export function saveDependent(dependent: Dependent): void {
  const dependents = getDependents();
  const index = dependents.findIndex(d => d.id === dependent.id);
  if (index >= 0) {
    dependents[index] = dependent;
    addActivityLog(`Updated dependent ${dependent.id} (${dependent.name})`);
  } else {
    dependents.push(dependent);
    addActivityLog(`Added dependent ${dependent.id} for Employee ${dependent.employeeId}`);
  }
  setItem(KEYS.DEPENDENTS, dependents);
}

export function deleteDependent(id: string): void {
  const dependents = getDependents().filter(d => d.id !== id);
  setItem(KEYS.DEPENDENTS, dependents);
  addActivityLog(`Deleted dependent ID ${id}`);
}

// Pensioners
export function getPensioners(): Pensioner[] {
  initializeStorage();
  return getItem<Pensioner[]>(KEYS.PENSIONERS, initialPensioners);
}

export function savePensioner(pensioner: Pensioner): void {
  const pensioners = getPensioners();
  const index = pensioners.findIndex(p => p.id === pensioner.id);
  if (index >= 0) {
    pensioners[index] = pensioner;
    addActivityLog(`Updated pensioner ${pensioner.id} (${pensioner.name})`);
  } else {
    pensioners.push(pensioner);
    addActivityLog(`Created pensioner record ${pensioner.id} (${pensioner.name})`);
  }
  setItem(KEYS.PENSIONERS, pensioners);
}

export function deletePensioner(id: string): void {
  const pensioners = getPensioners().filter(p => p.id !== id);
  setItem(KEYS.PENSIONERS, pensioners);
  addActivityLog(`Deleted pensioner ID ${id}`);
}

export function retireEmployee(
  employeeId: string,
  dateOfRetirement: string,
  pensionOrderNo: string,
  pensionPayOrder?: string
): Pensioner | null {
  const emp = getEmployeeById(employeeId);
  if (!emp) return null;

  // Mark employee as Retired
  emp.status = 'Retired';
  emp.dor = dateOfRetirement;
  saveEmployee(emp);

  // Create pensioner record
  const pensioner: Pensioner = {
    id: emp.id,
    name: emp.name,
    type: emp.type,
    lastDesignation: emp.designation,
    lastDepartment: emp.department,
    dob: emp.dob,
    doj: emp.doj,
    dateOfRetirement,
    pensionOrderNo: pensionOrderNo || `PPO/UOH/${new Date().getFullYear()}/${emp.id}`,
    pensionPayOrder: pensionPayOrder || pensionOrderNo,
    gender: emp.gender,
    address: emp.presentAddress || emp.permanentAddress,
    contactNumber: emp.contactNumber,
    bloodGroup: emp.bloodGroup,
    photoUrl: emp.photoUrl,
    signatureUrl: emp.signatureUrl,
    status: 'Active'
  };

  savePensioner(pensioner);
  addActivityLog(`Retired Employee ${emp.id} (${emp.name}) -> Created Pensioner Record`);
  return pensioner;
}

// Masters
export function getDepartments(): MasterItem[] {
  initializeStorage();
  return getItem<MasterItem[]>(KEYS.DEPARTMENTS, initialDepartments);
}

export function saveDepartment(dept: MasterItem): void {
  const depts = getDepartments();
  const idx = depts.findIndex(d => d.id === dept.id);
  if (idx >= 0) depts[idx] = dept;
  else depts.push(dept);
  setItem(KEYS.DEPARTMENTS, depts);
  addActivityLog(`Saved department ${dept.name}`);
}

export function getDesignations(): MasterItem[] {
  initializeStorage();
  return getItem<MasterItem[]>(KEYS.DESIGNATIONS, initialDesignations);
}

export function saveDesignation(desg: MasterItem): void {
  const desgs = getDesignations();
  const idx = desgs.findIndex(d => d.id === desg.id);
  if (idx >= 0) desgs[idx] = desg;
  else desgs.push(desg);
  setItem(KEYS.DESIGNATIONS, desgs);
  addActivityLog(`Saved designation ${desg.name}`);
}

// Competent Authorities
export function getAuthorities(): CompetentAuthority[] {
  initializeStorage();
  return getItem<CompetentAuthority[]>(KEYS.AUTHORITIES, initialAuthorities);
}

export function getCurrentAuthority(type: 'Vice-Chancellor' | 'Registrar'): CompetentAuthority | undefined {
  const list = getAuthorities().filter(a => a.type === type);
  // resolve latest effectiveFrom
  list.sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime());
  return list[0];
}

export function addAuthority(auth: CompetentAuthority): void {
  const list = getAuthorities();
  list.push(auth);
  setItem(KEYS.AUTHORITIES, list);
  addActivityLog(`Updated Competent Authority (${auth.type}): ${auth.name}`);
}

// Card Templates
export function getCardTemplates(): CardTemplate[] {
  initializeStorage();
  return getItem<CardTemplate[]>(KEYS.TEMPLATES, initialCardTemplates);
}

export function getCardTemplate(cardType: CardType): CardTemplate {
  const templates = getCardTemplates();
  const found = templates.find(t => t.cardType === cardType);
  if (found) return found;
  // fallback to initial
  return initialCardTemplates.find(t => t.cardType === cardType) || initialCardTemplates[0];
}

export function saveCardTemplate(template: CardTemplate): void {
  const templates = getCardTemplates();
  const idx = templates.findIndex(t => t.cardType === template.cardType || t.id === template.id);
  if (idx >= 0) templates[idx] = template;
  else templates.push(template);
  setItem(KEYS.TEMPLATES, templates);
  addActivityLog(`Updated Card Template settings for ${template.cardType}`);
}

// Logs
export function getActivityLogs(): ActivityLog[] {
  initializeStorage();
  return getItem<ActivityLog[]>(KEYS.LOGS, initialActivityLogs);
}

export function addActivityLog(action: string, details?: string): void {
  if (!isClient()) return;
  const session = getSession();
  const logs = getItem<ActivityLog[]>(KEYS.LOGS, initialActivityLogs);
  const newLog: ActivityLog = {
    id: `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    username: session ? session.username : 'System',
    role: session ? session.role : 'operator',
    action,
    details: details || action
  };
  logs.unshift(newLog); // newest first
  // Keep last 100 logs
  if (logs.length > 100) logs.pop();
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
}

// Operators
export function getOperators(): OperatorAccount[] {
  initializeStorage();
  return getItem<OperatorAccount[]>(KEYS.OPERATORS, initialOperators);
}

export function addOperator(op: OperatorAccount): void {
  const list = getOperators();
  list.push(op);
  setItem(KEYS.OPERATORS, list);
  addActivityLog(`Created Operator login for Employee ID ${op.employeeId} (${op.username})`);
}

// Reset
export function resetAllData(): void {
  initializeStorage(true);
}
