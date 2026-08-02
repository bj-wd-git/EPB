/** Phase 6 in-memory logic for tests (mirrors BFF domain rules) */
function createPhase6Store(baseStore) {
  const incidents = [];
  const consents = [];
  const capaActions = [];
  const sessions = [];
  const apiKeys = [];
  const accessLogs = [];
  const devices = [];

  return {
    incidents,
    consents,
    capaActions,
    sessions,
    apiKeys,
    accessLogs,
    devices,

    reportIncident(title, description, severity, reportedBy) {
      const incident = { id: `inc-${incidents.length + 1}`, title, description, severity: severity || 'medium', status: 'open', reportedBy };
      incidents.push(incident);
      baseStore.audit.publish({ actorId: reportedBy, action: 'compliance.incident', resource: 'compliance_incident', resourceId: incident.id });
      return incident;
    },

    resolveIncident(id, actorId) {
      const incident = incidents.find((i) => i.id === id);
      if (!incident) throw new Error('Not found');
      incident.status = 'resolved';
      baseStore.audit.publish({ actorId, action: 'compliance.resolve', resource: 'compliance_incident', resourceId: id });
      return incident;
    },

    recordConsent(patientUhid, formType, actorId) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const consent = { id: `con-${consents.length + 1}`, patientUhid, formType, status: 'signed' };
      consents.push(consent);
      baseStore.audit.publish({ actorId, action: 'compliance.consent', resource: 'consent_record', resourceId: consent.id });
      return consent;
    },

    createCapa(incidentId, action, assignedTo, actorId) {
      const incident = incidents.find((i) => i.id === incidentId);
      if (!incident) throw new Error('Not found');
      const capa = { id: `capa-${capaActions.length + 1}`, incidentId, action, assignedTo, status: 'open' };
      capaActions.push(capa);
      baseStore.audit.publish({ actorId, action: 'compliance.capa', resource: 'capa_action', resourceId: capa.id });
      return capa;
    },

    auditSummary() {
      return {
        standards: [{ code: 'NABH-PC', status: 'compliant' }],
        incidents: { open: incidents.filter((i) => i.status === 'open').length, resolved: incidents.filter((i) => i.status === 'resolved').length },
        openCapaActions: capaActions.filter((c) => c.status === 'open').length,
      };
    },

    createSession(actorId, role) {
      const session = { id: `sess-${sessions.length + 1}`, actorId, role, status: 'active', valid: true };
      sessions.push(session);
      return session;
    },

    createApiKey(name, role, actorId) {
      const key = { id: `key-${apiKeys.length + 1}`, name, role, token: `hms_test_${apiKeys.length + 1}`, status: 'active' };
      apiKeys.push(key);
      baseStore.audit.publish({ actorId, action: 'security.apikey', resource: 'api_key', resourceId: key.id });
      return key;
    },

    logAccess(actorId, method, path) {
      const log = { id: `log-${accessLogs.length + 1}`, actorId, method, path };
      accessLogs.push(log);
      return log;
    },

    registerDevice(userId, appType, platform, deviceToken, actorId) {
      const device = { id: `dev-${devices.length + 1}`, userId, appType, platform, deviceToken, status: 'active' };
      devices.push(device);
      baseStore.audit.publish({ actorId, action: 'mobile.register', resource: 'mobile_device', resourceId: device.id });
      return device;
    },

    patientSync(patientUhid) {
      const patient = baseStore.patients.find((p) => p.uhid === patientUhid);
      if (!patient) throw Object.assign(new Error('Patient not found'), { code: 'NOT_FOUND' });
      const appts = baseStore.appointments.filter((a) => a.patientUhid === patientUhid);
      return { app: 'patient', uhid: patientUhid, appointments: appts };
    },

    nurseSync(beds) {
      const occupied = beds.filter((b) => b.status === 'occupied').length;
      return { app: 'nurse', ward: { totalBeds: beds.length, occupied, available: beds.length - occupied } };
    },
  };
}

module.exports = { createPhase6Store };
