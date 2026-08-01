/** Phase 2 in-memory logic for tests (mirrors BFF domain rules) */
function createPhase2Store(baseStore) {
  const labTests = [
    { code: 'CBC', name: 'Complete Blood Count', price: 350 },
    { code: 'LFT', name: 'Liver Function Test', price: 800 },
  ];
  const labOrders = [];
  const radiologyOrders = [];
  const prescriptions = [];
  const invoices = [];

  return {
    labTests,
    labOrders,
    radiologyOrders,
    prescriptions,
    invoices,

    orderLab(patientUhid, testCodes, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const order = { id: `lo-${labOrders.length + 1}`, patientUhid, testCodes, status: 'ordered', results: null };
      labOrders.push(order);
      baseStore.audit.publish({ actorId, action: 'lab.order', resource: 'lab_order', resourceId: order.id });
      return order;
    },

    completeLab(id, results) {
      const order = labOrders.find((o) => o.id === id);
      if (!order) throw new Error('Not found');
      order.results = results;
      order.status = 'completed';
      return order;
    },

    orderRadiology(patientUhid, modality, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const order = { id: `ro-${radiologyOrders.length + 1}`, patientUhid, modality, status: 'ordered' };
      radiologyOrders.push(order);
      baseStore.audit.publish({ actorId, action: 'radiology.order', resource: 'radiology_order', resourceId: order.id });
      return order;
    },

    prescribe(patientUhid, items, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const rx = { id: `rx-${prescriptions.length + 1}`, patientUhid, items, status: 'prescribed' };
      prescriptions.push(rx);
      baseStore.audit.publish({ actorId, action: 'pharmacy.prescribe', resource: 'prescription', resourceId: rx.id });
      return rx;
    },

    dispense(rxId) {
      const rx = prescriptions.find((r) => r.id === rxId);
      if (!rx) throw new Error('Not found');
      if (rx.status === 'dispensed') throw Object.assign(new Error('Already dispensed'), { code: 'BAD_REQUEST' });
      rx.status = 'dispensed';
      return rx;
    },

    createInvoice(patientUhid, lines, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const total = lines.reduce((s, l) => s + l.amount, 0);
      const inv = { id: `inv-${invoices.length + 1}`, patientUhid, lines, total, status: 'draft' };
      invoices.push(inv);
      baseStore.audit.publish({ actorId, action: 'billing.invoice', resource: 'invoice', resourceId: inv.id });
      return inv;
    },

    payInvoice(id) {
      const inv = invoices.find((i) => i.id === id);
      if (!inv) throw new Error('Not found');
      inv.status = 'paid';
      return inv;
    },
  };
}

module.exports = { createPhase2Store };
