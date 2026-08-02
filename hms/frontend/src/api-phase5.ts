import { authHeaders } from './auth';

async function apiPost(path: string, body: unknown, headers: Record<string, string>) {
  const res = await fetch(`/api/v1${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
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

export function getPatientDashboard(uhid: string) {
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/dashboard`, authHeaders('patient'));
}

export function getPatientAppointments(uhid: string) {
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/appointments`, authHeaders('patient'));
}

export function getPatientBills(uhid: string) {
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/bills`, authHeaders('patient'));
}

export function getPatientPrescriptions(uhid: string) {
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/prescriptions`, authHeaders('patient'));
}

export function bookPortalAppointment(uhid: string, doctorId: string, slotStart: string, slotEnd: string) {
  return apiPost(`/portal/patient/${encodeURIComponent(uhid)}/appointments`, { doctorId, slotStart, slotEnd }, authHeaders('patient'));
}

export function bookTeleconsult(uhid: string, doctorId: string, scheduledAt: string) {
  return apiPost(`/portal/patient/${encodeURIComponent(uhid)}/teleconsult`, { doctorId, scheduledAt }, authHeaders('patient'));
}

export function getDoctorSchedule(doctorId: string) {
  return apiGet(`/portal/doctor/${doctorId}/schedule`, authHeaders('doctor'));
}

export function getDoctorLabQueue(doctorId: string) {
  return apiGet(`/portal/doctor/${doctorId}/lab-queue`, authHeaders('doctor'));
}

export function addDoctorNote(doctorId: string, patientUhid: string, text: string) {
  return apiPost(`/portal/doctor/${doctorId}/notes`, { patientUhid, text }, authHeaders('doctor'));
}

export function sendMessage(channel: string, recipient: string, body: string, subject?: string) {
  return apiPost('/communications/messages', { channel, recipient, body, subject }, authHeaders('clerk'));
}

export function listMessages() {
  return apiGet('/communications/messages', authHeaders('clerk'));
}

export function sendAppointmentReminder(appointmentId: string) {
  return apiPost('/communications/reminders/appointment', { appointmentId }, authHeaders('clerk'));
}
