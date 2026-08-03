import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { getSession, clearSession, type HmsSession } from './auth';

export type NavItem = { path: string; label: string };
export type NavGroup = { id: string; label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'core',
    label: 'Front desk',
    items: [
      { path: '/', label: 'Dashboard' },
      { path: '/registration', label: 'Registration' },
      { path: '/appointments/new', label: 'Appointment' },
    ],
  },
  {
    id: 'diagnostics',
    label: 'Diagnostics & billing',
    items: [
      { path: '/lab', label: 'Laboratory' },
      { path: '/radiology', label: 'Radiology' },
      { path: '/pharmacy', label: 'Pharmacy' },
      { path: '/billing', label: 'Billing' },
    ],
  },
  {
    id: 'inpatient',
    label: 'Inpatient & acute',
    items: [
      { path: '/ward', label: 'Ward' },
      { path: '/ipd', label: 'IPD' },
      { path: '/ot', label: 'OT' },
      { path: '/emergency', label: 'Emergency' },
    ],
  },
  {
    id: 'ops',
    label: 'Operations',
    items: [
      { path: '/insurance', label: 'Insurance' },
      { path: '/hr', label: 'HR' },
      { path: '/inventory', label: 'Inventory' },
      { path: '/reports', label: 'Reports' },
    ],
  },
  {
    id: 'portals',
    label: 'Portals & quality',
    items: [
      { path: '/portal/patient', label: 'Patient portal' },
      { path: '/portal/doctor', label: 'Doctor portal' },
      { path: '/communications', label: 'Communications' },
      { path: '/compliance', label: 'Compliance' },
      { path: '/security', label: 'Security' },
      { path: '/mobile', label: 'Mobile' },
      { path: '/admin', label: 'Admin' },
    ],
  },
];

function useSessionState() {
  const [session, setSession] = useState<HmsSession | null>(getSession());
  useEffect(() => {
    const sync = () => setSession(getSession());
    window.addEventListener('storage', sync);
    window.addEventListener('hms-session', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('hms-session', sync);
    };
  }, []);
  return session;
}

export function AppShell({ children }: { children?: ReactNode }) {
  const session = useSessionState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function logout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-brand">
          <Link to="/" className="brand-mark" onClick={() => setOpen(false)}>
            <span className="brand-glyph" aria-hidden>H</span>
            <span className="brand-text">
              <strong>HMS</strong>
              <small>Clinical workspace</small>
            </span>
          </Link>
          <button type="button" className="sidebar-close lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsed[group.id];
            return (
              <div key={group.id} className="nav-group">
                <button
                  type="button"
                  className="nav-group-label"
                  onClick={() => setCollapsed((c) => ({ ...c, [group.id]: !c[group.id] }))}
                  aria-expanded={!isCollapsed}
                >
                  {group.label}
                  <span className="nav-chevron">{isCollapsed ? '+' : '–'}</span>
                </button>
                {!isCollapsed && (
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          end={item.path === '/'}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {session ? (
            <>
              <div className="session-chip">
                <span className="session-role">{session.role}</span>
                <span className="session-actor">{session.actorId}</span>
              </div>
              <button type="button" className="btn-ghost" onClick={logout}>Sign out</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center" onClick={() => setOpen(false)}>Sign in</Link>
          )}
        </div>
      </aside>

      {open && <button type="button" className="sidebar-backdrop lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <div className="app-main">
        <header className="app-topbar">
          <button type="button" className="menu-toggle lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            Menu
          </button>
          <p className="topbar-hint">Demo UHID · BRN000001 – BRN000005</p>
          {session && (
            <span className="topbar-session">{session.role}</span>
          )}
        </header>
        <div className="app-content">{children ?? <Outlet />}</div>
      </div>
    </div>
  );
}

export function PageLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="page">
      <header className="page-header">
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </header>
      {children}
    </main>
  );
}
