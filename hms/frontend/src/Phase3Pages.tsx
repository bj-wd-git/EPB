import { useEffect, useState } from 'react';
import {
  listWards, getOccupancy, listBeds, admitPatient, dischargePatient,
  bookOt, registerErVisit, triageErVisit, listActiveErVisits,
} from './api-phase3';
import { SEED_DOCTOR_ID } from './config';

type Ward = { id: string; name: string };
type Bed = { id: string; code: string; status: string };
type ErVisit = { id: string; walkInName?: string; patientId?: string; triageLevel: string; chiefComplaint?: string };

export function WardPage() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [occupancy, setOccupancy] = useState<{ total: number; occupied: number; available: number; occupancyRate: number } | null>(null);
  const [selectedWard, setSelectedWard] = useState('');
  const [beds, setBeds] = useState<Bed[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    listWards().then(setWards).catch((e) => setMsg(e.message));
    getOccupancy().then(setOccupancy).catch(() => {});
  }, []);

  async function loadBeds(wardId: string) {
    setSelectedWard(wardId);
    try {
      setBeds(await listBeds(wardId));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error');
    }
  }

  return (
    <div className="space-y-4">
      {occupancy && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="card"><p className="text-sm text-slate-500">Total Beds</p><p className="text-2xl font-bold">{occupancy.total}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Occupied</p><p className="text-2xl font-bold text-amber-600">{occupancy.occupied}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Available</p><p className="text-2xl font-bold text-green-600">{occupancy.available}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Occupancy</p><p className="text-2xl font-bold">{occupancy.occupancyRate}%</p></div>
        </div>
      )}
      <div className="card max-w-lg space-y-3">
        <h2 className="font-semibold">Wards</h2>
        <div className="flex flex-wrap gap-2">
          {wards.map((w) => (
            <button key={w.id} type="button" className={`rounded-lg border px-3 py-1 text-sm ${selectedWard === w.id ? 'bg-primary-600 text-white' : 'hover:bg-slate-50'}`} onClick={() => loadBeds(w.id)}>
              {w.name}
            </button>
          ))}
        </div>
        {beds.length > 0 && (
          <ul className="space-y-1 text-sm">
            {beds.map((b) => (
              <li key={b.id} className="flex justify-between rounded bg-slate-50 px-3 py-2">
                <span>{b.code}</span>
                <span className={b.status === 'available' ? 'text-green-600' : 'text-amber-600'}>{b.status}</span>
              </li>
            ))}
          </ul>
        )}
        {msg && <p className="text-sm text-red-600">{msg}</p>}
      </div>
    </div>
  );
}

export function IpdPage() {
  const [uhid, setUhid] = useState('');
  const [bedId, setBedId] = useState('');
  const [admissionId, setAdmissionId] = useState('');
  const [msg, setMsg] = useState('');
  const [wards, setWards] = useState<Ward[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);

  useEffect(() => {
    listWards().then(setWards).catch(() => {});
  }, []);

  async function loadBeds(wardId: string) {
    setBeds(await listBeds(wardId));
  }

  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold">Inpatient Admission</h2>
      <input className="field" placeholder="Patient UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
      <select className="field" onChange={(e) => loadBeds(e.target.value)} defaultValue="">
        <option value="" disabled>Select ward</option>
        {wards.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
      </select>
      <select className="field" value={bedId} onChange={(e) => setBedId(e.target.value)}>
        <option value="" disabled>Select bed</option>
        {beds.filter((b) => b.status === 'available').map((b) => <option key={b.id} value={b.id}>{b.code}</option>)}
      </select>
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const r = await admitPatient(uhid, bedId);
          setAdmissionId(r.admissionId);
          setMsg(`Admitted to bed ${r.bedCode}`);
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Admit Patient</button>
      {admissionId && (
        <button type="button" className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={async () => {
          try {
            await dischargePatient(admissionId);
            setMsg('Patient discharged');
            setAdmissionId('');
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Discharge</button>
      )}
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function OtPage() {
  const [uhid, setUhid] = useState('');
  const [procedure, setProcedure] = useState('Appendectomy');
  const [msg, setMsg] = useState('');
  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold">Operation Theatre</h2>
      <input className="field" placeholder="Patient UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
      <input className="field" placeholder="Procedure" value={procedure} onChange={(e) => setProcedure(e.target.value)} />
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const r = await bookOt(uhid, SEED_DOCTOR_ID, procedure, new Date(Date.now() + 86400000).toISOString());
          setMsg(`OT booked: ${r.bookingId} — ${r.procedure}`);
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Book Surgery</button>
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function EmergencyPage() {
  const [uhid, setUhid] = useState('');
  const [walkIn, setWalkIn] = useState('');
  const [complaint, setComplaint] = useState('');
  const [visits, setVisits] = useState<ErVisit[]>([]);
  const [msg, setMsg] = useState('');

  async function refresh() {
    try { setVisits(await listActiveErVisits()); } catch { /* empty */ }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-4">
      <div className="card max-w-lg space-y-4">
        <h2 className="font-semibold">Emergency Registration</h2>
        <input className="field" placeholder="Patient UHID (optional)" value={uhid} onChange={(e) => setUhid(e.target.value)} />
        <input className="field" placeholder="Walk-in name (if no UHID)" value={walkIn} onChange={(e) => setWalkIn(e.target.value)} />
        <input className="field" placeholder="Chief complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} />
        <button type="button" className="btn-primary" onClick={async () => {
          try {
            const r = await registerErVisit({ patientUhid: uhid || undefined, walkInName: walkIn || undefined, chiefComplaint: complaint });
            setMsg(`ER visit ${r.visitId} registered`);
            refresh();
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Register ER Visit</button>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </div>
      <div className="card max-w-lg">
        <h2 className="mb-3 font-semibold">Active ER Queue</h2>
        {visits.length === 0 ? <p className="text-sm text-slate-500">No active visits</p> : (
          <ul className="space-y-2 text-sm">
            {visits.map((v) => (
              <li key={v.id} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2">
                <span>{v.walkInName || v.patientId || v.id} — {v.chiefComplaint || '—'}</span>
                <div className="flex gap-1">
                  {['1', '2', '3', '4', '5'].map((lvl) => (
                    <button key={lvl} type="button" className={`rounded px-2 py-0.5 text-xs ${v.triageLevel === lvl ? 'bg-red-600 text-white' : 'border hover:bg-slate-100'}`} onClick={async () => {
                      await triageErVisit(v.id, lvl);
                      refresh();
                    }}>{lvl}</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
