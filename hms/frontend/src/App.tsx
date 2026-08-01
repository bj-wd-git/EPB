import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const pages = [
  { path: '/', label: 'Dashboard' },
  { path: '/registration', label: 'Registration' },
  { path: '/appointments/new', label: 'Appointment' },
  { path: '/admin', label: 'Admin' },
];

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <strong>HMS</strong>
        {pages.map((p) => (
          <Link key={p.path} to={p.path}>{p.label}</Link>
        ))}
      </nav>
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
  return <main style={{ padding: '1rem' }}><h1>Dashboard</h1><p>Today&apos;s appointments and queue summary.</p></main>;
}

function Login() {
  return <main style={{ padding: '1rem' }}><h1>Login</h1><p>Staff authentication — connects to BFF /api/v1/auth/login.</p></main>;
}

function Registration() {
  return <main style={{ padding: '1rem' }}><h1>Patient Registration</h1><p>POST /api/v1/patients — UHID issued on success.</p></main>;
}

function Appointment() {
  return <main style={{ padding: '1rem' }}><h1>Book Appointment</h1><p>Doctor picker, slot calendar, POST /api/v1/appointments.</p></main>;
}

function Emr() {
  return <main style={{ padding: '1rem' }}><h1>EMR</h1><p>Patient banner, allergies (warning badge), vitals, notes tabs.</p></main>;
}

function Admin() {
  return <main style={{ padding: '1rem' }}><h1>Administration</h1><p>Hospitals, branches, users, roles — admin RBAC.</p></main>;
}
