/** Phase 4 in-memory logic for tests (mirrors BFF domain rules) */
function createPhase4Store(baseStore) {
  const policies = [];
  const claims = [];
  const employees = [
    { id: 'e1', employeeCode: 'EMP-001', firstName: 'Priya', lastName: 'Sharma', department: 'Nursing', designation: 'Staff Nurse', status: 'active' },
  ];
  const leaveRequests = [];
  const items = [
    { id: 'i1', sku: 'SYR-10ML', name: 'Syringe 10ml', category: 'Consumables', unit: 'box', quantity: 50, reorderLevel: 20 },
    { id: 'i2', sku: 'BND-ROLL', name: 'Bandage Roll', category: 'Consumables', unit: 'pack', quantity: 5, reorderLevel: 10 },
  ];
  const movements = [];

  return {
    policies,
    claims,
    employees,
    leaveRequests,
    items,
    movements,

    createPolicy(patientUhid, provider, policyNumber, coverageLimit, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const policy = { id: `pol-${policies.length + 1}`, patientUhid, provider, policyNumber, coverageLimit, status: 'active' };
      policies.push(policy);
      baseStore.audit.publish({ actorId, action: 'insurance.policy', resource: 'insurance_policy', resourceId: policy.id });
      return policy;
    },

    submitClaim(patientUhid, policyId, amount, actorId) {
      const policy = policies.find((p) => p.id === policyId && p.patientUhid === patientUhid);
      if (!policy) throw Object.assign(new Error('Policy not found'), { code: 'NOT_FOUND' });
      const claim = { id: `clm-${claims.length + 1}`, patientUhid, policyId, amount, status: 'submitted' };
      claims.push(claim);
      baseStore.audit.publish({ actorId, action: 'insurance.claim', resource: 'insurance_claim', resourceId: claim.id });
      return claim;
    },

    settleClaim(id) {
      const claim = claims.find((c) => c.id === id);
      if (!claim) throw new Error('Not found');
      claim.status = 'settled';
      return claim;
    },

    createEmployee(dto) {
      const emp = { id: `e${employees.length + 1}`, ...dto, status: 'active' };
      employees.push(emp);
      return emp;
    },

    requestLeave(employeeId, leaveType, fromDate, toDate, actorId) {
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) throw Object.assign(new Error('Employee not found'), { code: 'NOT_FOUND' });
      const leave = { id: `lv-${leaveRequests.length + 1}`, employeeId, leaveType, fromDate, toDate, status: 'pending' };
      leaveRequests.push(leave);
      baseStore.audit.publish({ actorId, action: 'hr.leave.request', resource: 'leave_request', resourceId: leave.id });
      return leave;
    },

    approveLeave(id) {
      const leave = leaveRequests.find((l) => l.id === id);
      if (!leave) throw new Error('Not found');
      leave.status = 'approved';
      return leave;
    },

    receiveStock(itemId, quantity, actorId) {
      const item = items.find((i) => i.id === itemId);
      if (!item) throw new Error('Not found');
      item.quantity += quantity;
      movements.push({ itemId, quantity, type: 'receipt' });
      baseStore.audit.publish({ actorId, action: 'inventory.receive', resource: 'inventory_item', resourceId: itemId });
      return item;
    },

    consumeStock(itemId, quantity, actorId) {
      const item = items.find((i) => i.id === itemId);
      if (!item) throw new Error('Not found');
      if (item.quantity < quantity) throw Object.assign(new Error('Insufficient stock'), { code: 'BAD_REQUEST' });
      item.quantity -= quantity;
      movements.push({ itemId, quantity, type: 'consumption' });
      baseStore.audit.publish({ actorId, action: 'inventory.consume', resource: 'inventory_item', resourceId: itemId });
      return item;
    },

    lowStock() {
      return items.filter((i) => i.quantity <= i.reorderLevel);
    },

    operationalReport() {
      return { totalPatients: baseStore.patients.length, totalEmployees: employees.length };
    },

    financialReport(invoices) {
      const paid = invoices.filter((i) => i.status === 'paid');
      return { totalRevenue: paid.reduce((s, i) => s + i.total, 0), paidCount: paid.length };
    },
  };
}

module.exports = { createPhase4Store };
