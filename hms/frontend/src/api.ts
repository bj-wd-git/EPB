const API = '/api/v1';

const clerkHeaders = { 'Content-Type': 'application/json', 'x-role': 'clerk', 'x-actor-id': 'fe-clerk' };
const doctorHeaders = { 'Content-Type': 'application/json', 'x-role': 'doctor', 'x-actor-id': 'fe-doctor' };

export async function registerPatient(body: Record<string, unknown>) {
  const res = await fetch(`${API}/patients`, { method: 'POST', headers: clerkHeaders, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.message?.message || data.error || 'Registration failed'), { status: res.status, data });
  return data as { uhid: string; patientId: string; createdAt: string };
}

export async function bookAppointment(body: Record<string, unknown>) {
  const res = await fetch(`${API}/appointments`, { method: 'POST', headers: clerkHeaders, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.message?.message || data.error || 'Booking failed'), { status: res.status, data });
  return data as { appointmentId: string; status: string; queuePosition: number | null };
}

export async function getEmr(uhid: string) {
  const res = await fetch(`${API}/patients/${encodeURIComponent(uhid)}/emr`, { headers: doctorHeaders });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'EMR load failed');
  return data as {
    uhid: string;
    allergies: { substance: string; severity: string; confirmed: boolean }[];
    notes: { authorId: string; text: string; createdAt: string }[];
    visits: { appointmentId: string; date: string }[];
  };
}

export async function addClinicalNote(uhid: string, text: string) {
  const res = await fetch(`${API}/patients/${encodeURIComponent(uhid)}/emr/notes`, {
    method: 'POST',
    headers: doctorHeaders,
    body: JSON.stringify({ authorId: 'fe-doctor', text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Note save failed');
  return data;
}

export async function getBranches() {
  const res = await fetch(`${API}/branches`);
  return res.json() as Promise<{ id: string; code: string; name: string }[]>;
}

export async function getDoctors() {
  const res = await fetch(`${API}/doctors`);
  return res.json() as Promise<{ id: string; name: string; department: string }[]>;
}
