import { BrowserRouter, Routes, Route, Link, NavLink, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { registerPatient, bookAppointment, getEmr, addClinicalNote } from './api';
import { SEED_BRANCH_ID, SEED_DOCTOR_ID, SLOTS } from './config';

const nav = [
  { path: '/', label: 'Dashboard' },
  { path: '/registration', label: 'Registration' },
  { path: '/appointments/new', label: 'Appointment' },
  { path: '/admin', label: 'Admin' },
];

function NavBar() {
  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <span className="text-lg font-bold text-primary-700">HMS</span>
        <div className="flex gap-4">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <Link to="/login" className="ml-auto text-sm text-slate-500 hover:text-primary-600">Login</Link>
      </div>
    </nav>
  );
}

function PageLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">{title}</h1>
      {children}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/appointments/new" element={<Appointment />} />
        <Route path="/patients/:uhid/emr" element={<Emr />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

function Dashboard() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  return (
    <PageLayout title="Dashboard">
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Today&apos;s Appointments</p><p className="mt-1 text-3xl font-bold text-primary-600">—</p></div>
        <div className="card"><p className="text-sm text-slate-500">Queue Waiting</p><p className="mt-1 text-3xl font-bold text-clinical-600">—</p></div>
        <div className="card"><p className="text-sm text-slate-500">New Registrations</p><p className="mt-1 text-3xl font-bold text-slate-800">—</p></div>
      </div>
      <div className="card max-w-md">
        <label className="mb-2 block text-sm font-medium">Quick patient search</label>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="UHID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Patient search"
          />
          <button type="button" className="btn-primary" onClick={() => search && navigate(`/patients/${search}/emr`)}>
            EMR
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

function Login() {
  return (
    <PageLayout title="Staff Login">
      <div className="card max-w-md">
        <p className="mb-4 text-sm text-slate-600">JWT auth — Phase 1.1. Use role headers in dev.</p>
        <button className="btn-primary w-full">Sign in</button>
      </div>
    </PageLayout>
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
    <PageLayout title="Patient Registration">
      <form onSubmit={onSubmit} className="card max-w-lg space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="firstName" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="First name" required />
          <input name="lastName" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Last name" required />
          <input name="dateOfBirth" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" required />
          <input name="phone" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" required />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Registering…' : 'Register Patient'}</button>
      </form>
      {uhid && (
        <div className="mt-4 card max-w-lg border-2 border-green-200 bg-green-50">
          <p className="text-sm text-green-800">UHID issued:</p>
          <p className="font-mono text-xl font-bold text-green-700">{uhid}</p>
          <button type="button" className="btn-primary mt-3" onClick={() => navigate(`/appointments/new?uhid=${uhid}`)}>Book Appointment</button>
        </div>
      )}
    </PageLayout>
  );
}

function Appointment() {
  const params = new URLSearchParams(window.location.search);
  const initialUhid = params.get('uhid') || '';
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
    <PageLayout title="Book Appointment">
      <div className="card max-w-lg space-y-4">
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Patient UHID"
          value={uhid}
          onChange={(e) => setUhid(e.target.value)}
        />
        <p className="text-sm text-slate-600">Doctor: Dr. Smith — General</p>
        <input type="date" className="w-full rounded-lg border px-3 py-2 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          {SLOTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSlot(s)}
              className={`rounded-lg border py-2 text-xs ${slot === s ? 'bg-primary-600 text-white' : 'hover:bg-slate-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {result && <p className="text-sm text-green-700">Booked: {result}</p>}
        <button type="button" className="btn-primary w-full" onClick={onBook} disabled={loading}>
          {loading ? 'Booking…' : 'Confirm Booking'}
        </button>
        {result && (
          <button type="button" className="text-sm text-primary-600" onClick={() => navigate(`/patients/${uhid}/emr`)}>
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

  if (loading) return <PageLayout title="EMR"><p className="text-sm text-slate-500">Loading…</p></PageLayout>;
  if (error && !data) return <PageLayout title="EMR"><p className="text-sm text-red-600" role="alert">{error}</p></PageLayout>;

  return (
    <PageLayout title="Electronic Medical Record">
      <div className="mb-4 flex items-center justify-between card">
        <div>
          <p className="font-bold">{data?.uhid}</p>
          <p className="text-sm text-slate-500">Patient record</p>
        </div>
        {hasAllergyAlert && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800" role="alert">Allergy alert</span>
        )}
      </div>
      <div className="mb-4 flex gap-2 border-b">
        {(['notes', 'visits'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize ${tab === t ? 'border-b-2 border-primary-600 font-medium text-primary-600' : 'text-slate-600'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'notes' && (
        <div className="card space-y-4">
          <ul className="space-y-2 text-sm">
            {data?.notes?.length ? data.notes.map((n, i) => (
              <li key={i} className="rounded-lg bg-slate-50 p-3">{n.text}<span className="mt-1 block text-xs text-slate-400">{n.createdAt}</span></li>
            )) : <li className="text-slate-500">No notes yet</li>}
          </ul>
          <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={3} placeholder="Clinical note..." value={note} onChange={(e) => setNote(e.target.value)} />
          <button type="button" className="btn-primary" onClick={saveNote}>Save Note</button>
        </div>
      )}
      {tab === 'visits' && (
        <div className="card">
          <ul className="text-sm space-y-2">
            {data?.visits?.length ? data.visits.map((v) => (
              <li key={v.appointmentId}>{v.date} — {v.appointmentId}</li>
            )) : <li className="text-slate-500">No visits</li>}
          </ul>
        </div>
      )}
    </PageLayout>
  );
}

function Admin() {
  return (
    <PageLayout title="Administration">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-semibold">Hospitals & Branches</h2>
          <p className="text-sm">Main Branch · BRN</p>
        </div>
        <div className="card">
          <h2 className="mb-3 font-semibold">Users & Roles</h2>
          <p className="text-sm">clerk, doctor, nurse, admin</p>
        </div>
      </div>
    </PageLayout>
  );
}
