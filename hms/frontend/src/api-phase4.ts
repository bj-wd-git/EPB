import { authHeaders } from './auth';

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
  return apiPost('/insurance/policies', { patientUhid, provider, policyNumber, coverageLimit }, authHeaders('clerk'));
}

export function listPolicies(patientUhid: string) {
  return apiGet(`/insurance/policies/patient/${encodeURIComponent(patientUhid)}`, authHeaders('clerk'));
}

export function submitClaim(patientUhid: string, policyId: string, amount: number) {
  return apiPost('/insurance/claims', { patientUhid, policyId, amount }, authHeaders('clerk'));
}

export function settleClaim(claimId: string) {
  return apiPatch(`/insurance/claims/${claimId}/settle`, {}, authHeaders('clerk'));
}

export function listEmployees() {
  return apiGet('/hr/employees', authHeaders('hr'));
}

export function requestLeave(employeeId: string, leaveType: string, fromDate: string, toDate: string) {
  return apiPost('/hr/leave', { employeeId, leaveType, fromDate, toDate }, authHeaders('hr'));
}

export function approveLeave(leaveId: string) {
  return apiPatch(`/hr/leave/${leaveId}/approve`, {}, authHeaders('hr'));
}

export function listInventoryItems() {
  return apiGet('/inventory/items', authHeaders('pharmacist'));
}

export function receiveStock(itemId: string, quantity: number) {
  return apiPost('/inventory/stock/receive', { itemId, quantity }, authHeaders('pharmacist'));
}

export function consumeStock(itemId: string, quantity: number) {
  return apiPost('/inventory/stock/consume', { itemId, quantity }, authHeaders('pharmacist'));
}

export function getLowStock() {
  return apiGet('/inventory/stock/low', authHeaders('pharmacist'));
}

export function getOperationalReport() {
  return apiGet('/reports/operational', authHeaders('admin'));
}

export function getFinancialReport() {
  return apiGet('/reports/financial', authHeaders('admin'));
}

export function getClinicalReport() {
  return apiGet('/reports/clinical', authHeaders('admin'));
}

export function getInventoryReport() {
  return apiGet('/reports/inventory', authHeaders('admin'));
}
