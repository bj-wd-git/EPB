import { useEffect, useState } from 'react';
import {
  createPolicy, listPolicies, submitClaim, settleClaim,
  listEmployees, requestLeave, approveLeave,
  listInventoryItems, receiveStock, consumeStock, getLowStock,
  getOperationalReport, getFinancialReport, getClinicalReport, getInventoryReport,
} from './api-phase4';

type Policy = { id: string; provider: string; policyNumber: string; coverageLimit: number };
type Employee = { id: string; employeeCode: string; firstName: string; lastName: string; department: string };
type Item = { id: string; sku: string; name: string; quantity: number; reorderLevel: number };

export function InsurancePage() {
  const [uhid, setUhid] = useState('');
  const [provider, setProvider] = useState('Star Health');
  const [policyNumber, setPolicyNumber] = useState('');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [msg, setMsg] = useState('');

  async function loadPolicies() {
    if (!uhid) return;
    try { setPolicies(await listPolicies(uhid)); } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
  }

  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold">Insurance (TPA)</h2>
      <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Patient UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
      <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} />
      <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Policy number" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const r = await createPolicy(uhid, provider, policyNumber, 500000);
          setMsg(`Policy ${r.policyId} created`);
          loadPolicies();
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Register Policy</button>
      <button type="button" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={loadPolicies}>Load Policies</button>
      {policies.length > 0 && (
        <ul className="space-y-2 text-sm">
          {policies.map((p) => (
            <li key={p.id} className="flex justify-between rounded bg-slate-50 px-3 py-2">
              <span>{p.provider} — {p.policyNumber}</span>
              <button type="button" className="text-xs text-primary-600" onClick={async () => {
                const claim = await submitClaim(uhid, p.id, 10000);
                const settled = await settleClaim(claim.claimId);
                setMsg(`Claim ${settled.claimId} settled ₹${settled.amount}`);
              }}>Submit & Settle Claim</button>
            </li>
          ))}
        </ul>
      )}
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function HrPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    listEmployees().then(setEmployees).catch(() => {});
  }, []);

  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold">HR & Leave</h2>
      <select className="w-full rounded-lg border px-3 py-2 text-sm" value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
        <option value="" disabled>Select employee</option>
        {employees.map((e) => <option key={e.id} value={e.id}>{e.employeeCode} — {e.firstName} {e.lastName} ({e.department})</option>)}
      </select>
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const leave = await requestLeave(selectedEmp, 'casual', '2026-08-10', '2026-08-11');
          const approved = await approveLeave(leave.leaveId);
          setMsg(`Leave ${approved.leaveId} approved`);
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Request & Approve Leave</button>
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState(10);
  const [msg, setMsg] = useState('');

  async function refresh() {
    try { setItems(await listInventoryItems()); } catch { /* empty */ }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-4">
      <div className="card max-w-lg space-y-4">
        <h2 className="font-semibold">Inventory</h2>
        <select className="w-full rounded-lg border px-3 py-2 text-sm" value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="" disabled>Select item</option>
          {items.map((i) => <option key={i.id} value={i.id}>{i.sku} — {i.name} (qty: {i.quantity})</option>)}
        </select>
        <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        <div className="flex gap-2">
          <button type="button" className="btn-primary" onClick={async () => {
            try { await receiveStock(selectedItem, qty); setMsg(`Received ${qty} units`); refresh(); } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Receive Stock</button>
          <button type="button" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
            try { await consumeStock(selectedItem, qty); setMsg(`Consumed ${qty} units`); refresh(); } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
          }}>Consume</button>
        </div>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </div>
      <div className="card max-w-lg">
        <h2 className="mb-2 font-semibold">Low Stock Alerts</h2>
        <button type="button" className="text-sm text-primary-600" onClick={async () => {
          const low = await getLowStock();
          setMsg(low.length ? `${low.length} item(s) below reorder level` : 'All stock levels OK');
        }}>Check Low Stock</button>
      </div>
    </div>
  );
}

export function ReportsPage() {
  const [ops, setOps] = useState<Record<string, unknown> | null>(null);
  const [fin, setFin] = useState<Record<string, unknown> | null>(null);
  const [clinical, setClinical] = useState<Record<string, unknown> | null>(null);
  const [inv, setInv] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    getOperationalReport().then(setOps).catch(() => {});
    getFinancialReport().then(setFin).catch(() => {});
    getClinicalReport().then(setClinical).catch(() => {});
    getInventoryReport().then(setInv).catch(() => {});
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ReportCard title="Operational" data={ops} />
      <ReportCard title="Financial" data={fin} />
      <ReportCard title="Clinical" data={clinical} />
      <ReportCard title="Inventory" data={inv} />
    </div>
  );
}

function ReportCard({ title, data }: { title: string; data: Record<string, unknown> | null }) {
  return (
    <div className="card">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {!data ? <p className="text-sm text-slate-500">Loading…</p> : (
        <dl className="space-y-1 text-sm">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-medium">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
