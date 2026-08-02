const patientHeaders = { 'Content-Type': 'application/json', 'x-role': 'patient', 'x-actor-id': 'fe-patient' };
const doctorHeaders = { 'Content-Type': 'application/json', 'x-role': 'doctor', 'x-actor-id': 'fe-doctor' };
const clerkHeaders = { 'Content-Type': 'application/json', 'x-role': 'clerk', 'x-actor-id': 'fe-clerk' };

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
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/dashboard`, patientHeaders);
}

export function getPatientAppointments(uhid: string) {
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/appointments`, patientHeaders);
}

export function getPatientBills(uhid: string) {
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/bills`, patientHeaders);
}

export function getPatientPrescriptions(uhid: string) {
  return apiGet(`/portal/patient/${encodeURIComponent(uhid)}/prescriptions`, patientHeaders);
}

export function bookPortalAppointment(uhid: string, doctorId: string, slotStart: string, slotEnd: string) {
  return apiPost(`/portal/patient/${encodeURIComponent(uhid)}/appointments`, { doctorId, slotStart, slotEnd }, patientHeaders);
}

export function bookTeleconsult(uhid: string, doctorId: string, scheduledAt: string) {
  return apiPost(`/portal/patient/${encodeURIComponent(uhid)}/teleconsult`, { doctorId, scheduledAt }, patientHeaders);
}

export function getDoctorSchedule(doctorId: string) {
  return apiGet(`/portal/doctor/${doctorId}/schedule`, doctorHeaders);
}

export function getDoctorLabQueue(doctorId: string) {
  return apiGet(`/portal/doctor/${doctorId}/lab-queue`, doctorHeaders);
}

export function addDoctorNote(doctorId: string, patientUhid: string, text: string) {
  return apiPost(`/portal/doctor/${doctorId}/notes`, { patientUhid, text }, doctorHeaders);
}

export function sendMessage(channel: string, recipient: string, body: string, subject?: string) {
  return apiPost('/communications/messages', { channel, recipient, body, subject }, clerkHeaders);
}

export function listMessages() {
  return apiGet('/communications/messages', clerkHeaders);
}

export function sendAppointmentReminder(appointmentId: string) {
  return apiPost('/communications/reminders/appointment', { appointmentId }, clerkHeaders);
}
