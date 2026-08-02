const adminHeaders = { 'Content-Type': 'application/json', 'x-role': 'admin', 'x-actor-id': 'fe-admin' };
const nurseHeaders = { 'Content-Type': 'application/json', 'x-role': 'nurse', 'x-actor-id': 'fe-nurse' };
const patientHeaders = { 'Content-Type': 'application/json', 'x-role': 'patient', 'x-actor-id': 'fe-patient' };
const doctorHeaders = { 'Content-Type': 'application/json', 'x-role': 'doctor', 'x-actor-id': 'fe-doctor' };

async function apiPost(path: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(`/api/v1${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

async function apiPatch(path: string, headers: Record<string, string>) {
  const res = await fetch(`/api/v1${path}`, { method: 'PATCH', headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

async function apiGet(path: string, headers: Record<string, string> = {}) {
  const res = await fetch(`/api/v1${path}`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

export function reportIncident(title: string, description: string, severity: string) {
  return apiPost('/compliance/incidents', { title, description, severity }, nurseHeaders);
}

export function listIncidents() {
  return apiGet('/compliance/incidents', adminHeaders);
}

export function resolveIncident(id: string) {
  return apiPatch(`/compliance/incidents/${id}/resolve`, adminHeaders);
}

export function recordConsent(patientUhid: string, formType: string) {
  return apiPost('/compliance/consents', { patientUhid, formType }, nurseHeaders);
}

export function getComplianceSummary() {
  return apiGet('/compliance/audit-summary', adminHeaders);
}

export function createSession(actorId: string, role: string) {
  return apiPost('/security/sessions', { actorId, role });
}

export function createApiKey(name: string, role: string) {
  return apiPost('/security/api-keys', { name, role }, adminHeaders);
}

export function listApiKeys() {
  return apiGet('/security/api-keys', adminHeaders);
}

export function listAccessLogs() {
  return apiGet('/security/access-logs', adminHeaders);
}

export function getPhiAudit() {
  return apiGet('/security/phi-audit', adminHeaders);
}

export function registerDevice(userId: string, appType: string, platform: string, deviceToken: string) {
  return apiPost('/mobile/devices', { userId, appType, platform, deviceToken }, patientHeaders);
}

export function patientMobileSync(uhid: string) {
  return apiGet(`/mobile/patient/${encodeURIComponent(uhid)}/sync`, patientHeaders);
}

export function doctorMobileSync(doctorId: string) {
  return apiGet(`/mobile/doctor/${doctorId}/sync`, doctorHeaders);
}

export function nurseMobileSync() {
  return apiGet('/mobile/nurse/sync', nurseHeaders);
}

export function listMobileDevices() {
  return apiGet('/mobile/devices', adminHeaders);
}
