import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

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
        <Link to="/login" className="ml-auto text-sm text-slate-500 hover:text-primary-600">
          Login
        </Link>
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
  return (
    <PageLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Today&apos;s Appointments</p>
          <p className="mt-1 text-3xl font-bold text-primary-600">—</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Queue Waiting</p>
          <p className="mt-1 text-3xl font-bold text-clinical-600">—</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">New Registrations</p>
          <p className="mt-1 text-3xl font-bold text-slate-800">—</p>
        </div>
      </div>
    </PageLayout>
  );
}

function Login() {
  return (
    <PageLayout title="Staff Login">
      <div className="card max-w-md">
        <p className="mb-4 text-sm text-slate-600">Connects to NestJS BFF — JWT auth (Phase 1.1).</p>
        <button className="btn-primary w-full">Sign in</button>
      </div>
    </PageLayout>
  );
}

function Registration() {
  return (
    <PageLayout title="Patient Registration">
      <div className="card max-w-lg space-y-4">
        <p className="text-sm text-slate-600">POST /api/v1/patients — UHID issued on success.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="First name" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Last name" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" />
        </div>
        <button className="btn-primary">Register Patient</button>
      </div>
    </PageLayout>
  );
}

function Appointment() {
  return (
    <PageLayout title="Book Appointment">
      <div className="card max-w-lg">
        <p className="mb-4 text-sm text-slate-600">Doctor picker, slot calendar → POST /api/v1/appointments</p>
        <button className="btn-primary">Confirm Booking</button>
      </div>
    </PageLayout>
  );
}

function Emr() {
  return (
    <PageLayout title="Electronic Medical Record">
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Allergy alert</span>
          <span className="text-sm text-slate-500">Unconfirmed allergies show warning badge</span>
        </div>
        <p className="text-sm text-slate-600">Tabs: History · Allergies · Vitals · Notes</p>
      </div>
    </PageLayout>
  );
}

function Admin() {
  return (
    <PageLayout title="Administration">
      <div className="card">
        <p className="text-sm text-slate-600">Hospitals, branches, users, roles — admin RBAC.</p>
      </div>
    </PageLayout>
  );
}
