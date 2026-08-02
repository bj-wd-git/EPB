const clerkHeaders = { 'Content-Type': 'application/json', 'x-role': 'clerk', 'x-actor-id': 'fe-clerk' };
const adminHeaders = { 'Content-Type': 'application/json', 'x-role': 'admin', 'x-actor-id': 'fe-admin' };
const hrHeaders = { 'Content-Type': 'application/json', 'x-role': 'hr', 'x-actor-id': 'fe-hr' };
const pharmacistHeaders = { 'Content-Type': 'application/json', 'x-role': 'pharmacist', 'x-actor-id': 'fe-pharmacist' };

async function apiPost(path: string, body: unknown, headers: Record<string, string>) {
  const res = await fetch(`/api/v1${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

async function apiPatch(path: string, body: unknown, headers: Record<string, string>) {
  const res = await fetch(`/api/v1${path}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

async function apiGet(path: string, headers: Record<string, string>) {
  const res = await fetch(`/api/v1${path}`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

export function createPolicy(patientUhid: string, provider: string, policyNumber: string, coverageLimit: number) {
  return apiPost('/insurance/policies', { patientUhid, provider, policyNumber, coverageLimit }, clerkHeaders);
}

export function listPolicies(patientUhid: string) {
  return apiGet(`/insurance/policies/patient/${encodeURIComponent(patientUhid)}`, clerkHeaders);
}

export function submitClaim(patientUhid: string, policyId: string, amount: number) {
  return apiPost('/insurance/claims', { patientUhid, policyId, amount }, clerkHeaders);
}

export function settleClaim(claimId: string) {
  return apiPatch(`/insurance/claims/${claimId}/settle`, {}, clerkHeaders);
}

export function listEmployees() {
  return apiGet('/hr/employees', hrHeaders);
}

export function requestLeave(employeeId: string, leaveType: string, fromDate: string, toDate: string) {
  return apiPost('/hr/leave', { employeeId, leaveType, fromDate, toDate }, hrHeaders);
}

export function approveLeave(leaveId: string) {
  return apiPatch(`/hr/leave/${leaveId}/approve`, {}, hrHeaders);
}

export function listInventoryItems() {
  return apiGet('/inventory/items', pharmacistHeaders);
}

export function receiveStock(itemId: string, quantity: number) {
  return apiPost('/inventory/stock/receive', { itemId, quantity }, pharmacistHeaders);
}

export function consumeStock(itemId: string, quantity: number) {
  return apiPost('/inventory/stock/consume', { itemId, quantity }, pharmacistHeaders);
}

export function getLowStock() {
  return apiGet('/inventory/stock/low', pharmacistHeaders);
}

export function getOperationalReport() {
  return apiGet('/reports/operational', adminHeaders);
}

export function getFinancialReport() {
  return apiGet('/reports/financial', adminHeaders);
}

export function getClinicalReport() {
  return apiGet('/reports/clinical', adminHeaders);
}

export function getInventoryReport() {
  return apiGet('/reports/inventory', adminHeaders);
}
