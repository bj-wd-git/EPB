export type HmsSession = {
  sessionId: string;
  actorId: string;
  role: string;
  expiresAt?: string;
};

const STORAGE_KEY = 'hms-session';

export function getSession(): HmsSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HmsSession) : null;
  } catch {
    return null;
  }
}

function notifySessionChange() {
  window.dispatchEvent(new Event('hms-session'));
}

export function setSession(session: HmsSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  notifySessionChange();
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  notifySessionChange();
}

export async function createSession(actorId: string, role: string): Promise<HmsSession> {
  const res = await fetch('/api/v1/security/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actorId, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Login failed');
  const session: HmsSession = {
    sessionId: data.sessionId,
    actorId: data.actorId,
    role: data.role,
    expiresAt: data.expiresAt,
  };
  setSession(session);
  return session;
}

/** Auth headers for BFF — uses logged-in session or explicit role fallback */
export function authHeaders(role?: string): Record<string, string> {
  const session = getSession();
  const effectiveRole = role ?? session?.role ?? 'clerk';
  const actorId = session?.actorId ?? `fe-${effectiveRole}`;
  return {
    'Content-Type': 'application/json',
    'x-role': effectiveRole,
    'x-actor-id': actorId,
    ...(session?.sessionId ? { 'x-session-id': session.sessionId } : {}),
  };
}
