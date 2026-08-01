const API = '/api/v1';

const headers = { 'Content-Type': 'application/json', 'x-role': 'clerk', 'x-actor-id': 'fe-clerk' };

export async function registerPatient(body: Record<string, unknown>) {
  const res = await fetch(`${API}/patients`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Registration failed'), { status: res.status, data });
  return data as { uhid: string; patientId: string; createdAt: string };
}

export async function bookAppointment(body: Record<string, unknown>) {
  const res = await fetch(`${API}/appointments`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Booking failed'), { status: res.status, data });
  return data;
}

export async function getEmr(uhid: string) {
  const res = await fetch(`${API}/patients/${uhid}/emr`, { headers: { ...headers, 'x-role': 'doctor' } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'EMR load failed');
  return data;
}
