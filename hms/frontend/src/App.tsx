import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, type FormEvent } from 'react';
import { registerPatient, bookAppointment, getEmr, addClinicalNote } from './api';
import { createSession, getSession } from './auth';
import { getOperationalReport, getClinicalReport } from './api-phase4';
import { getOccupancy } from './api-phase3';
import { SEED_BRANCH_ID, SEED_DOCTOR_ID, SLOTS } from './config';
import { AppShell, PageLayout } from './layout';
import { LabPage, RadiologyPage, PharmacyPage, BillingPage } from './Phase2Pages';
import { WardPage, IpdPage, OtPage, EmergencyPage } from './Phase3Pages';
import { InsurancePage, HrPage, InventoryPage, ReportsPage } from './Phase4Pages';
import { PatientPortalPage, DoctorPortalPage, CommunicationsPage } from './Phase5Pages';
import { CompliancePage, SecurityPage, MobileAppsPage } from './Phase6Pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <AppShell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/appointments/new" element={<Appointment />} />
                <Route path="/patients/:uhid/emr" element={<Emr />} />
                <Route path="/lab" element={<PageLayout title="Laboratory" subtitle="Order panels and track results"><LabPage /></PageLayout>} />
                <Route path="/radiology" element={<PageLayout title="Radiology" subtitle="Imaging orders and reports"><RadiologyPage /></PageLayout>} />
                <Route path="/pharmacy" element={<PageLayout title="Pharmacy" subtitle="Prescribe and dispense"><PharmacyPage /></PageLayout>} />
                <Route path="/billing" element={<PageLayout title="Billing" subtitle="Invoices and payments"><BillingPage /></PageLayout>} />
                <Route path="/ward" element={<PageLayout title="Ward management" subtitle="Beds and occupancy"><WardPage /></PageLayout>} />
                <Route path="/ipd" element={<PageLayout title="Inpatient (IPD)" subtitle="Admit, transfer, discharge"><IpdPage /></PageLayout>} />
                <Route path="/ot" element={<PageLayout title="Operation theatre" subtitle="Procedure scheduling"><OtPage /></PageLayout>} />
                <Route path="/emergency" element={<PageLayout title="Emergency" subtitle="Triage and active visits"><EmergencyPage /></PageLayout>} />
                <Route path="/insurance" element={<PageLayout title="Insurance (TPA)" subtitle="Policies and claims"><InsurancePage /></PageLayout>} />
                <Route path="/hr" element={<PageLayout title="Human resources" subtitle="Staff and leave"><HrPage /></PageLayout>} />
                <Route path="/inventory" element={<PageLayout title="Inventory" subtitle="Stock and reorder alerts"><InventoryPage /></PageLayout>} />
                <Route path="/reports" element={<PageLayout title="Reports & analytics" subtitle="Operational and clinical MIS"><ReportsPage /></PageLayout>} />
                <Route path="/portal/patient" element={<PageLayout title="Patient portal" subtitle="Self-service appointments and records"><PatientPortalPage /></PageLayout>} />
                <Route path="/portal/doctor" element={<PageLayout title="Doctor portal" subtitle="Schedule and clinical queue"><DoctorPortalPage /></PageLayout>} />
                <Route path="/communications" element={<PageLayout title="Communication center" subtitle="SMS, email, WhatsApp, push"><CommunicationsPage /></PageLayout>} />
                <Route path="/compliance" element={<PageLayout title="Compliance & quality" subtitle="Incidents, consent, CAPA"><CompliancePage /></PageLayout>} />
                <Route path="/security" element={<PageLayout title="Security" subtitle="Sessions, API keys, access logs"><SecurityPage /></PageLayout>} />
                <Route path="/mobile" element={<PageLayout title="Mobile apps" subtitle="Device registration and sync"><MobileAppsPage /></PageLayout>} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function Dashboard() {
  const [search, setSearch] = useState('BRN000001');
  const [stats, setStats] = useState({ patients: '—', occupancy: '—', beds: '—', er: '—', labPending: '—' });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([getOperationalReport(), getOccupancy(), getClinicalReport()]).then(([ops, occ, clin]) => {
      const next = { ...stats };
      if (ops.status === 'fulfilled') {
        const d = ops.value as { totalPatients?: number; activeErVisits?: number; beds?: { occupancyRate?: number } };
        next.patients = String(d.totalPatients ?? '—');
        next.er = String(d.activeErVisits ?? '—');
        if (d.beds?.occupancyRate != null) next.occupancy = `${d.beds.occupancyRate}%`;
      }
      if (occ.status === 'fulfilled') {
        const d = occ.value as { occupied?: number; total?: number; occupancyRate?: number };
        next.beds = `${d.occupied ?? 0}/${d.total ?? 0}`;
        if (d.occupancyRate != null) next.occupancy = `${d.occupancyRate}%`;
      }
      if (clin.status === 'fulfilled') {
        const d = clin.value as { pendingLabOrders?: number };
        next.labPending = String(d.pendingLabOrders ?? '—');
      }
      setStats(next);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageLayout title="Dashboard" subtitle="Live snapshot from demo clinical data">
      <div className="stat-grid">
        <div className="card stat-tile">
          <p className="stat-label">Registered patients</p>
          <p className="stat-value">{stats.patients}</p>
        </div>
        <div className="card stat-tile">
          <p className="stat-label">Bed occupancy</p>
          <p className="stat-value is-clinical">{stats.occupancy}</p>
          <p className="muted mt-1 text-xs">{stats.beds} beds occupied</p>
        </div>
        <div className="card stat-tile">
          <p className="stat-label">Active ER · pending labs</p>
          <p className="stat-value is-ink">{stats.er} · {stats.labPending}</p>
        </div>
      </div>

      <div className="panel-split">
        <div className="card">
          <label className="label" htmlFor="uhid-search">Quick patient search</label>
          <div className="flex gap-2">
            <input
              id="uhid-search"
              className="field flex-1"
              placeholder="UHID e.g. BRN000001"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Patient search"
            />
            <button type="button" className="btn-primary" onClick={() => search && navigate(`/patients/${search.trim()}/emr`)}>
              Open EMR
            </button>
          </div>
          <p className="muted mt-3 text-sm">Try demo patients BRN000001–BRN000005 after staff login.</p>
        </div>

        <div>
          <p className="label mb-2">Shortcuts</p>
          <div className="quick-grid">
            <Link className="quick-link" to="/registration"><strong>Register patient</strong><span>Issue UHID in under two minutes</span></Link>
            <Link className="quick-link" to="/appointments/new"><strong>Book appointment</strong><span>Doctor + slot confirmation</span></Link>
            <Link className="quick-link" to="/emergency"><strong>Emergency board</strong><span>Triage active visits</span></Link>
            <Link className="quick-link" to="/reports"><strong>MIS reports</strong><span>Operational and financial</span></Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function Login() {
  const existing = getSession();
  const [actorId, setActorId] = useState(existing?.actorId || 'staff-1');
  const [role, setRole] = useState(existing?.role || 'clerk');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createSession(actorId, role);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <section className="login-hero" aria-hidden={false}>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Enterprise HMS</p>
          <h1>Clinical care, one workspace.</h1>
          <p>Registration, wards, diagnostics, and portals — built for front-desk speed and ward clarity.</p>
        </div>
      </section>
      <section className="login-panel">
        <form onSubmit={onSubmit} className="card login-card space-y-4">
          <div className="brand-inline">
            <span className="brand-glyph">H</span>
            <div>
              <strong className="font-display text-lg">HMS</strong>
              <p className="muted m-0 text-xs">Staff sign-in</p>
            </div>
          </div>
          <h2>Sign in</h2>
          <p className="lede">Security session sets your role for every API call. Demo roles work without a password.</p>
          <div>
            <label className="label" htmlFor="actor">Actor ID</label>
            <input id="actor" className="field" placeholder="staff-1" value={actorId} onChange={(e) => setActorId(e.target.value)} required />
          </div>
          <div>
            <label className="label" htmlFor="role">Role</label>
            <select id="role" className="field" value={role} onChange={(e) => setRole(e.target.value)}>
              {['clerk', 'doctor', 'nurse', 'admin', 'pharmacist', 'lab', 'hr', 'patient'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          {error && <p className="alert-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Enter workspace'}</button>
        </form>
      </section>
    </div>
  );
}

function Registration() {
  const [uhid, setUhid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const result = await registerPatient({
        firstName: fd.get('firstName'),
        lastName: fd.get('lastName'),
        dateOfBirth: fd.get('dateOfBirth'),
        phone: fd.get('phone'),
        branchId: SEED_BRANCH_ID,
      });
      setUhid(result.uhid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout title="Patient registration" subtitle="Demographics → UHID in one step">
      <form onSubmit={onSubmit} className="card max-w-lg space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">First name</label>
            <input name="firstName" className="field" required />
          </div>
          <div>
            <label className="label">Last name</label>
            <input name="lastName" className="field" required />
          </div>
          <div>
            <label className="label">Date of birth</label>
            <input name="dateOfBirth" className="field" type="date" required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" className="field" placeholder="+91…" required />
          </div>
        </div>
        {error && <p className="alert-error" role="alert">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Registering…' : 'Register patient'}</button>
      </form>
      {uhid && (
        <div className="card mt-4 max-w-lg border-clinical-600/20 bg-clinical-50">
          <p className="text-sm font-semibold text-clinical-700">UHID issued</p>
          <p className="mt-1 font-mono text-2xl font-bold text-clinical-700">{uhid}</p>
          <button type="button" className="btn-primary mt-4" onClick={() => navigate(`/appointments/new?uhid=${uhid}`)}>Book appointment</button>
        </div>
      )}
    </PageLayout>
  );
}

function Appointment() {
  const params = new URLSearchParams(window.location.search);
  const initialUhid = params.get('uhid') || 'BRN000001';
  const [uhid, setUhid] = useState(initialUhid);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onBook() {
    if (!uhid.trim()) { setError('Enter patient UHID'); return; }
    setError(null);
    setLoading(true);
    const slotStart = `${date}T${slot}:00Z`;
    const [h, m] = slot.split(':').map(Number);
    const endM = m + 15;
    const slotEnd = `${date}T${String(h + Math.floor(endM / 60)).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}:00Z`;
    try {
      const appt = await bookAppointment({
        patientUhid: uhid.trim(),
        doctorId: SEED_DOCTOR_ID,
        slotStart,
        slotEnd,
        type: 'scheduled',
      });
      setResult(appt.appointmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout title="Book appointment" subtitle="Patient · doctor · slot">
      <div className="card max-w-lg space-y-4">
        <div>
          <label className="label">Patient UHID</label>
          <input className="field" value={uhid} onChange={(e) => setUhid(e.target.value)} />
        </div>
        <p className="muted text-sm">Doctor: Dr. Smith — General</p>
        <div>
          <label className="label">Date</label>
          <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <p className="label">Slot</p>
          <div className="grid grid-cols-3 gap-2">
            {SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={`rounded-xl border py-2.5 text-sm font-medium transition ${slot === s ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-200 hover:border-primary-600/40'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="alert-error" role="alert">{error}</p>}
        {result && <p className="alert-success">Booked · {result}</p>}
        <button type="button" className="btn-primary w-full" onClick={onBook} disabled={loading}>
          {loading ? 'Booking…' : 'Confirm booking'}
        </button>
        {result && (
          <button type="button" className="text-sm font-semibold text-primary-600" onClick={() => navigate(`/patients/${uhid}/emr`)}>
            Open EMR →
          </button>
        )}
      </div>
    </PageLayout>
  );
}

function Emr() {
  const { uhid = '' } = useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getEmr>> | null>(null);
  const [note, setNote] = useState('');
  const [tab, setTab] = useState<'notes' | 'visits'>('notes');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uhid) return;
    getEmr(uhid)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [uhid]);

  async function saveNote() {
    if (!note.trim() || !uhid) return;
    try {
      await addClinicalNote(uhid, note.trim());
      setNote('');
      setData(await getEmr(uhid));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  }

  const hasAllergyAlert = data?.allergies?.some((a) => !a.confirmed);

  if (loading) return <PageLayout title="EMR"><p className="muted text-sm">Loading…</p></PageLayout>;
  if (error && !data) return <PageLayout title="EMR"><p className="alert-error" role="alert">{error}</p></PageLayout>;

  return (
    <PageLayout title="Electronic medical record" subtitle={`Patient ${data?.uhid ?? uhid}`}>
      <div className="card mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-bold">{data?.uhid}</p>
          <p className="muted text-sm">Clinical chart</p>
        </div>
        {hasAllergyAlert && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800" role="alert">Allergy alert</span>
        )}
      </div>
      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {(['notes', 'visits'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm capitalize transition ${tab === t ? 'border-b-2 border-primary-600 font-semibold text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'notes' && (
        <div className="card space-y-4">
          <ul className="space-y-2 text-sm">
            {data?.notes?.length ? data.notes.map((n, i) => (
              <li key={i} className="rounded-xl bg-slate-50 p-3 leading-relaxed">{n.text}<span className="muted mt-1 block text-xs">{n.createdAt}</span></li>
            )) : <li className="muted">No notes yet</li>}
          </ul>
          <textarea className="field" rows={3} placeholder="Clinical note…" value={note} onChange={(e) => setNote(e.target.value)} />
          <button type="button" className="btn-primary" onClick={saveNote}>Save note</button>
        </div>
      )}
      {tab === 'visits' && (
        <div className="card">
          <ul className="space-y-2 text-sm">
            {data?.visits?.length ? data.visits.map((v) => (
              <li key={v.appointmentId} className="flex justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
                <span>{v.date}</span>
                <span className="muted font-mono text-xs">{v.appointmentId}</span>
              </li>
            )) : <li className="muted">No visits</li>}
          </ul>
        </div>
      )}
    </PageLayout>
  );
}

function Admin() {
  return (
    <PageLayout title="Administration" subtitle="Hospitals, branches, and roles">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h2 className="font-display mb-3 text-base font-semibold">Hospitals & branches</h2>
          <p className="text-sm">Main Branch · BRN</p>
          <p className="muted mt-1 text-sm">East Clinic · EST</p>
        </div>
        <div className="card">
          <h2 className="font-display mb-3 text-base font-semibold">Users & roles</h2>
          <p className="text-sm">clerk, doctor, nurse, admin, pharmacist, lab, hr, patient</p>
        </div>
      </div>
    </PageLayout>
  );
}
