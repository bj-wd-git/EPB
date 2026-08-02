const nurseHeaders = { 'Content-Type': 'application/json', 'x-role': 'nurse', 'x-actor-id': 'fe-nurse' };
const doctorHeaders = { 'Content-Type': 'application/json', 'x-role': 'doctor', 'x-actor-id': 'fe-doctor' };
const clerkHeaders = { 'Content-Type': 'application/json', 'x-role': 'clerk', 'x-actor-id': 'fe-clerk' };

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

export function listWards() {
  return apiGet('/wards', nurseHeaders);
}

export function getOccupancy() {
  return apiGet('/wards/occupancy', nurseHeaders);
}

export function listBeds(wardId: string) {
  return apiGet(`/wards/${wardId}/beds`, nurseHeaders);
}

export function admitPatient(patientUhid: string, bedId: string) {
  return apiPost('/ipd/admissions', { patientUhid, bedId }, nurseHeaders);
}

export function dischargePatient(admissionId: string) {
  return apiPost(`/ipd/admissions/${admissionId}/discharge`, {}, nurseHeaders);
}

export function bookOt(patientUhid: string, surgeonId: string, procedure: string, scheduledAt: string) {
  return apiPost('/ot/bookings', { patientUhid, surgeonId, procedure, scheduledAt }, doctorHeaders);
}

export function registerErVisit(input: { patientUhid?: string; walkInName?: string; chiefComplaint?: string }) {
  return apiPost('/emergency/visits', input, clerkHeaders);
}

export function triageErVisit(visitId: string, triageLevel: string) {
  return apiPatch(`/emergency/visits/${visitId}/triage`, { triageLevel }, nurseHeaders);
}

export function listActiveErVisits() {
  return apiGet('/emergency/visits/active', nurseHeaders);
}
