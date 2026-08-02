import { useEffect, useState } from 'react';
import {
  reportIncident, listIncidents, resolveIncident, recordConsent, getComplianceSummary,
  createSession, createApiKey, listApiKeys, listAccessLogs, getPhiAudit,
  registerDevice, patientMobileSync, doctorMobileSync, nurseMobileSync, listMobileDevices,
} from './api-phase6';
import { SEED_DOCTOR_ID } from './config';

type Incident = { id: string; title: string; severity: string; status: string };
type Summary = { standards: { code: string; name: string; status: string }[]; incidents: { open: number; resolved: number }; openCapaActions: number };

export function CompliancePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [consentUhid, setConsentUhid] = useState('');
  const [msg, setMsg] = useState('');

  async function refresh() {
    try {
      setIncidents(await listIncidents());
      setSummary(await getComplianceSummary());
    } catch { /* empty */ }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid gap-4 sm:grid-cols-4">
          {summary.standards.map((s) => (
            <div key={s.code} className="card">
              <p className="text-xs text-slate-500">{s.code}</p>
              <p className="text-sm font-medium">{s.name}</p>
              <p className={`text-xs ${s.status === 'compliant' ? 'text-green-600' : 'text-amber-600'}`}>{s.status}</p>
            </div>
          ))}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-4">
          <h2 className="font-semibold">Report Incident</h2>
          <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="button" className="btn-primary" onClick={async () => {
            try {
              const r = await reportIncident(title, description, 'medium');
              setMsg(`Incident ${r.incidentId} reported`);
              refresh();
            } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Report</button>
          <hr />
          <h3 className="text-sm font-medium">Record Consent</h3>
          <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Patient UHID" value={consentUhid} onChange={(e) => setConsentUhid(e.target.value)} />
          <button type="button" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
            try {
              const r = await recordConsent(consentUhid, 'treatment');
              setMsg(`Consent ${r.consentId} signed`);
            } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Sign Consent</button>
          {msg && <p className="text-sm text-green-700">{msg}</p>}
        </div>
        <div className="card">
          <h2 className="mb-3 font-semibold">Incidents ({summary?.incidents.open ?? 0} open)</h2>
          <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
            {incidents.map((i) => (
              <li key={i.id} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2">
                <span>{i.title} <span className="text-xs text-slate-400">({i.severity})</span></span>
                {i.status === 'open' && (
                  <button type="button" className="text-xs text-primary-600" onClick={async () => { await resolveIncident(i.id); refresh(); }}>Resolve</button>
                )}
                {i.status === 'resolved' && <span className="text-xs text-green-600">resolved</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SecurityPage() {
  const [session, setSession] = useState<{ sessionId: string; role: string } | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [keys, setKeys] = useState<{ id: string; name: string; keyPrefix: string; role: string }[]>([]);
  const [phiCount, setPhiCount] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    listApiKeys().then(setKeys).catch(() => {});
    getPhiAudit().then((e) => setPhiCount(e.length)).catch(() => {});
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-4">
        <h2 className="font-semibold">Security</h2>
        <button type="button" className="btn-primary" onClick={async () => {
          try {
            const s = await createSession('admin-1', 'admin');
            setSession(s);
            setMsg(`Session ${s.sessionId} created`);
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Create Session</button>
        {session && <p className="text-sm text-slate-600">Active session: {session.sessionId} ({session.role})</p>}
        <button type="button" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
          try {
            const k = await createApiKey('Integration', 'clerk');
            setApiKey(k.token);
            setMsg(`API key created: ${k.keyPrefix}…`);
            setKeys(await listApiKeys());
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Generate API Key</button>
        {apiKey && <p className="break-all rounded bg-amber-50 p-2 font-mono text-xs">{apiKey}</p>}
        <p className="text-sm text-slate-500">PHI audit events: {phiCount}</p>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </div>
      <div className="card">
        <h2 className="mb-3 font-semibold">API Keys</h2>
        <ul className="space-y-1 text-sm">
          {keys.map((k) => <li key={k.id} className="rounded bg-slate-50 px-3 py-2">{k.name} — {k.role} (…{k.keyPrefix})</li>)}
        </ul>
      </div>
    </div>
  );
}

export function MobileAppsPage() {
  const [uhid, setUhid] = useState('');
  const [patientData, setPatientData] = useState<Record<string, unknown> | null>(null);
  const [doctorData, setDoctorData] = useState<Record<string, unknown> | null>(null);
  const [nurseData, setNurseData] = useState<Record<string, unknown> | null>(null);
  const [msg, setMsg] = useState('');

  return (
    <div className="space-y-4">
      <div className="card max-w-lg space-y-4">
        <h2 className="font-semibold">Mobile App Sync</h2>
        <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Patient UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={async () => {
            try {
              setPatientData(await patientMobileSync(uhid));
              await registerDevice(uhid, 'patient', 'ios', `token-${Date.now()}`);
              setMsg('Patient app synced');
            } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Patient App</button>
          <button type="button" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
            try { setDoctorData(await doctorMobileSync(SEED_DOCTOR_ID)); setMsg('Doctor app synced'); } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Doctor App</button>
          <button type="button" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
            try { setNurseData(await nurseMobileSync()); setMsg('Nurse app synced'); } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Nurse App</button>
        </div>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <SyncCard title="Patient" data={patientData} />
        <SyncCard title="Doctor" data={doctorData} />
        <SyncCard title="Nurse" data={nurseData} />
      </div>
    </div>
  );
}

function SyncCard({ title, data }: { title: string; data: Record<string, unknown> | null }) {
  return (
    <div className="card">
      <h3 className="mb-2 font-medium">{title} Sync</h3>
      {!data ? <p className="text-sm text-slate-500">Not synced</p> : (
        <pre className="max-h-48 overflow-auto text-xs text-slate-600">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
