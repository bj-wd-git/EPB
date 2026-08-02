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

export function listLabTests() {
  return apiGet('/lab/tests', authHeaders('lab'));
}

export function orderLab(patientUhid: string, testCodes: string[]) {
  return apiPost('/lab/orders', { patientUhid, testCodes }, authHeaders('doctor'));
}

export function orderRadiology(patientUhid: string, modality: string) {
  return apiPost('/radiology/orders', { patientUhid, modality }, authHeaders('doctor'));
}

export function prescribe(patientUhid: string, items: { drug: string; dose: string; frequency: string }[]) {
  return apiPost('/pharmacy/prescriptions', { patientUhid, items }, authHeaders('doctor'));
}

export function createInvoice(patientUhid: string, lines: { description: string; amount: number }[]) {
  return apiPost('/billing/invoices', { patientUhid, lines }, authHeaders('clerk'));
}

export function payInvoice(invoiceId: string) {
  return apiPost(`/billing/invoices/${invoiceId}/pay`, {}, authHeaders('clerk'));
}

export function listInvoices(patientUhid: string) {
  return apiGet(`/billing/invoices/patient/${encodeURIComponent(patientUhid)}`, authHeaders('clerk'));
}
