import { useState } from 'react';
import { listLabTests, orderLab, orderRadiology, prescribe, createInvoice, payInvoice } from './api-phase2';

export function LabPage() {
  const [uhid, setUhid] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold text-slate-800">Laboratory</h2>
      <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Patient UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const tests = await listLabTests();
          const r = await orderLab(uhid, tests.slice(0, 2).map((t: { code: string }) => t.code));
          setMsg(`Lab order ${r.orderId}`);
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Order CBC + LFT</button>
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function RadiologyPage() {
  const [uhid, setUhid] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold">Radiology</h2>
      <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const r = await orderRadiology(uhid, 'xray');
          setMsg(`Radiology order ${r.orderId}`);
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Order X-Ray</button>
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function PharmacyPage() {
  const [uhid, setUhid] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold">Pharmacy</h2>
      <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const r = await prescribe(uhid, [{ drug: 'Paracetamol', dose: '500mg', frequency: 'TDS' }]);
          setMsg(`Prescription ${r.prescriptionId}`);
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Prescribe</button>
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}

export function BillingPage() {
  const [uhid, setUhid] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div className="card max-w-lg space-y-4">
      <h2 className="font-semibold">Billing</h2>
      <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="UHID" value={uhid} onChange={(e) => setUhid(e.target.value)} />
      <button type="button" className="btn-primary" onClick={async () => {
        try {
          const inv = await createInvoice(uhid, [
            { description: 'Consultation', amount: 500 },
            { description: 'Lab CBC', amount: 350 },
          ]);
          const paid = await payInvoice(inv.invoiceId);
          setMsg(`Paid ₹${paid.total}`);
        } catch (e) { setMsg(e instanceof Error ? e.message : 'Error'); }
      }}>Create & Pay Invoice</button>
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </div>
  );
}
