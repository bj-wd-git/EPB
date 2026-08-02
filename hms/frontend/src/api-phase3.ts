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

const nurse = () => authHeaders('nurse');
const doctor = () => authHeaders('doctor');
const clerk = () => authHeaders('clerk');

export function listWards() {
  return apiGet('/wards', nurse());
}

export function getOccupancy() {
  return apiGet('/wards/occupancy', nurse());
}

export function listBeds(wardId: string) {
  return apiGet(`/wards/${wardId}/beds`, nurse());
}

export function admitPatient(patientUhid: string, bedId: string) {
  return apiPost('/ipd/admissions', { patientUhid, bedId }, nurse());
}

export function dischargePatient(admissionId: string) {
  return apiPost(`/ipd/admissions/${admissionId}/discharge`, {}, nurse());
}

export function bookOt(patientUhid: string, surgeonId: string, procedure: string, scheduledAt: string) {
  return apiPost('/ot/bookings', { patientUhid, surgeonId, procedure, scheduledAt }, doctor());
}

export function registerErVisit(input: { patientUhid?: string; walkInName?: string; chiefComplaint?: string }) {
  return apiPost('/emergency/visits', input, clerk());
}

export function triageErVisit(visitId: string, triageLevel: string) {
  return apiPatch(`/emergency/visits/${visitId}/triage`, { triageLevel }, nurse());
}

export function listActiveErVisits() {
  return apiGet('/emergency/visits/active', nurse());
}
