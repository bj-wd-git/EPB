import { useEffect, useState } from 'react';
import {
  getPatientDashboard, getPatientAppointments, getPatientBills, getPatientPrescriptions,
  bookPortalAppointment, bookTeleconsult,
  getDoctorSchedule, getDoctorLabQueue, addDoctorNote,
  sendMessage, listMessages, sendAppointmentReminder,
} from './api-phase5';
import { SEED_DOCTOR_ID } from './config';

type Dashboard = { uhid: string; upcomingAppointments: number; pendingBills: number; pendingAmount: number; prescriptions: number; labReports: number; scheduledTeleconsults: number };
type Appt = { appointmentId: string; doctorId: string; slotStart: string; status: string };
type Message = { id: string; channel: string; recipient: string; body: string; status: string };

export function PatientPortalPage() {
  const [uhid, setUhid] = useState('');
  const [dash, setDash] = useState<Dashboard | null>(null);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    if (!uhid) return;
    try {
      setDash(await getPatientDashboard(uhid));
      setAppts(await getPatientAppointments(uhid));
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
  }

  return (
    <div className="space-y-4">
      <div className="card max-w-lg space-y-4">
        <h2 className="font-semibold">Patient Portal</h2>
        <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Your UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
        <button type="button" className="btn-primary" onClick={load}>Load Dashboard</button>
      </div>
      {dash && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card"><p className="text-sm text-slate-500">Upcoming Appts</p><p className="text-2xl font-bold">{dash.upcomingAppointments}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Pending Bills</p><p className="text-2xl font-bold text-amber-600">₹{dash.pendingAmount}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Teleconsults</p><p className="text-2xl font-bold">{dash.scheduledTeleconsults}</p></div>
        </div>
      )}
      <div className="card max-w-lg space-y-3">
        <h3 className="font-medium">Quick Actions</h3>
        <button type="button" className="btn-primary w-full" onClick={async () => {
          try {
            const tomorrow = new Date(Date.now() + 86400000);
            const slot = tomorrow.toISOString().slice(0, 10);
            const r = await bookPortalAppointment(uhid, SEED_DOCTOR_ID, `${slot}T10:00:00Z`, `${slot}T10:15:00Z`);
            setMsg(`Booked appointment ${r.appointmentId}`);
            load();
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Book Online Appointment</button>
        <button type="button" className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
          try {
            const r = await bookTeleconsult(uhid, SEED_DOCTOR_ID, new Date(Date.now() + 172800000).toISOString());
            setMsg(`Teleconsult ${r.sessionId} scheduled`);
            load();
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Book Teleconsultation</button>
      </div>
      {appts.length > 0 && (
        <div className="card max-w-lg">
          <h3 className="mb-2 font-medium">My Appointments</h3>
          <ul className="space-y-1 text-sm">
            {appts.map((a) => <li key={a.appointmentId} className="rounded bg-slate-50 px-3 py-2">{new Date(a.slotStart).toLocaleString()} — {a.status}</li>)}
          </ul>
        </div>
      )}
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function DoctorPortalPage() {
  const [schedule, setSchedule] = useState<{ appointments: Appt[]; teleconsults: { sessionId: string; scheduledAt: string }[] } | null>(null);
  const [labQueue, setLabQueue] = useState<{ orderId: string; patientUhid: string; testCodes: string[] }[]>([]);
  const [noteUhid, setNoteUhid] = useState('');
  const [noteText, setNoteText] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDoctorSchedule(SEED_DOCTOR_ID).then(setSchedule).catch(() => {});
    getDoctorLabQueue(SEED_DOCTOR_ID).then(setLabQueue).catch(() => {});
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-3">
        <h2 className="font-semibold">Today&apos;s Schedule</h2>
        {!schedule ? <p className="text-sm text-slate-500">Loading…</p> : (
          <>
            <h3 className="text-sm font-medium text-slate-600">Appointments ({schedule.appointments.length})</h3>
            <ul className="space-y-1 text-sm">
              {schedule.appointments.map((a) => <li key={a.appointmentId} className="rounded bg-slate-50 px-3 py-2">{new Date(a.slotStart).toLocaleString()} — {a.status}</li>)}
            </ul>
            <h3 className="text-sm font-medium text-slate-600">Teleconsults ({schedule.teleconsults.length})</h3>
            <ul className="space-y-1 text-sm">
              {schedule.teleconsults.map((t) => <li key={t.sessionId} className="rounded bg-blue-50 px-3 py-2">{new Date(t.scheduledAt).toLocaleString()}</li>)}
            </ul>
          </>
        )}
      </div>
      <div className="space-y-4">
        <div className="card space-y-3">
          <h2 className="font-semibold">Lab Review Queue</h2>
          {labQueue.length === 0 ? <p className="text-sm text-slate-500">No pending lab orders</p> : (
            <ul className="space-y-1 text-sm">
              {labQueue.map((o) => <li key={o.orderId} className="rounded bg-slate-50 px-3 py-2">{o.patientUhid} — {o.testCodes.join(', ')}</li>)}
            </ul>
          )}
        </div>
        <div className="card space-y-3">
          <h2 className="font-semibold">Add Clinical Note</h2>
          <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Patient UHID" value={noteUhid} onChange={(e) => setNoteUhid(e.target.value)} />
          <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} placeholder="Note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <button type="button" className="btn-primary" onClick={async () => {
            try {
              await addDoctorNote(SEED_DOCTOR_ID, noteUhid, noteText);
              setMsg('Note saved');
              setNoteText('');
            } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Save Note</button>
          {msg && <p className="text-sm text-green-700">{msg}</p>}
        </div>
      </div>
    </div>
  );
}

export function CommunicationsPage() {
  const [channel, setChannel] = useState('sms');
  const [recipient, setRecipient] = useState('');
  const [body, setBody] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointmentId, setAppointmentId] = useState('');
  const [msg, setMsg] = useState('');

  async function refresh() {
    try { setMessages(await listMessages()); } catch { /* empty */ }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-4">
        <h2 className="font-semibold">Send Message</h2>
        <select className="w-full rounded-lg border px-3 py-2 text-sm" value={channel} onChange={(e) => setChannel(e.target.value)}>
          {['sms', 'email', 'whatsapp', 'push'].map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
        <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={3} placeholder="Message body" value={body} onChange={(e) => setBody(e.target.value)} />
        <button type="button" className="btn-primary" onClick={async () => {
          try {
            const r = await sendMessage(channel, recipient, body);
            setMsg(`Sent ${r.messageId} via ${r.channel}`);
            refresh();
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Send</button>
        <hr />
        <h3 className="text-sm font-medium">Appointment Reminder</h3>
        <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Appointment ID" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} />
        <button type="button" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
          try {
            const r = await sendAppointmentReminder(appointmentId);
            setMsg(`Reminder sent: ${r.messageId}`);
            refresh();
          } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
        }}>Send Reminder</button>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </div>
      <div className="card">
        <h2 className="mb-3 font-semibold">Recent Messages</h2>
        {messages.length === 0 ? <p className="text-sm text-slate-500">No messages yet</p> : (
          <ul className="max-h-96 space-y-2 overflow-y-auto text-sm">
            {messages.map((m) => (
              <li key={m.id} className="rounded bg-slate-50 px-3 py-2">
                <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">{m.channel}</span>
                <span className="ml-2 text-slate-500">{m.recipient}</span>
                <p className="mt-1">{m.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
