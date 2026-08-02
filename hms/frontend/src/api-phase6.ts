import { authHeaders } from './auth';

async function apiPost(path: string, body: unknown, role?: string) {
  const res = await fetch(`/api/v1${path}`, { method: 'POST', headers: role ? authHeaders(role) : { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

async function apiPatch(path: string, role: string) {
  const res = await fetch(`/api/v1${path}`, { method: 'PATCH', headers: authHeaders(role) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

async function apiGet(path: string, role: string) {
  const res = await fetch(`/api/v1${path}`, { headers: authHeaders(role) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

export function reportIncident(title: string, description: string, severity: string) {
  return apiPost('/compliance/incidents', { title, description, severity }, 'nurse');
}

export function listIncidents() {
  return apiGet('/compliance/incidents', 'admin');
}

export function resolveIncident(id: string) {
  return apiPatch(`/compliance/incidents/${id}/resolve`, 'admin');
}

export function recordConsent(patientUhid: string, formType: string) {
  return apiPost('/compliance/consents', { patientUhid, formType }, 'nurse');
}

export function getComplianceSummary() {
  return apiGet('/compliance/audit-summary', 'admin');
}

export function createApiKey(name: string, role: string) {
  return apiPost('/security/api-keys', { name, role }, 'admin');
}

export function listApiKeys() {
  return apiGet('/security/api-keys', 'admin');
}

export function listAccessLogs() {
  return apiGet('/security/access-logs', 'admin');
}

export function getPhiAudit() {
  return apiGet('/security/phi-audit', 'admin');
}

export function registerDevice(userId: string, appType: string, platform: string, deviceToken: string) {
  return apiPost('/mobile/devices', { userId, appType, platform, deviceToken }, 'patient');
}

export function patientMobileSync(uhid: string) {
  return apiGet(`/mobile/patient/${encodeURIComponent(uhid)}/sync`, 'patient');
}

export function doctorMobileSync(doctorId: string) {
  return apiGet(`/mobile/doctor/${doctorId}/sync`, 'doctor');
}

export function nurseMobileSync() {
  return apiGet('/mobile/nurse/sync', 'nurse');
}

export function listMobileDevices() {
  return apiGet('/mobile/devices', 'admin');
}
