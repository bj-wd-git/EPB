/**
 * @deprecated Use NestJS BFF (apps/bff/src/main.ts) with MySQL.
 * Legacy Node HTTP scaffold — kept for reference.
 */
const http = require('http');
const { createHmsStore } = require('../../../libs/common/src/store');

const ROLES = {
  admin: ['*'],
  clerk: ['patients:read', 'patients:write', 'appointments:write', 'emr:read'],
  doctor: ['patients:read', 'emr:read', 'emr:write', 'appointments:read'],
  nurse: ['patients:read', 'emr:read', 'emr:write'],
};

function hasPermission(role, perm) {
  const perms = ROLES[role] || [];
  return perms.includes('*') || perms.includes(perm);
}

function createBffServer(store = createHmsStore()) {
  return http.createServer((req, res) => {
    const send = (code, body) => {
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };

    const role = req.headers['x-role'] || 'clerk';
    const actorId = req.headers['x-actor-id'] || 'system';
    const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/v1/health') {
      return send(200, { status: 'ok', service: 'hms-bff' });
    }

    if (req.method === 'POST' && url.pathname === '/api/v1/patients') {
      if (!hasPermission(role, 'patients:write')) return send(403, { error: 'Forbidden' });
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        try {
          const input = JSON.parse(body);
          const patient = store.registerPatient(input, actorId);
          send(201, { uhid: patient.uhid, patientId: patient.id, createdAt: patient.createdAt });
        } catch (e) {
          if (e.code === 'DUPLICATE') return send(409, { error: e.message, existingUhid: e.existingUhid });
          send(400, { error: e.message });
        }
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/v1/appointments') {
      if (!hasPermission(role, 'appointments:write')) return send(403, { error: 'Forbidden' });
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        try {
          const appt = store.bookAppointment(JSON.parse(body), actorId);
          send(201, { appointmentId: appt.id, status: appt.status, queuePosition: appt.queuePosition });
        } catch (e) {
          if (e.code === 'CONFLICT') return send(409, { error: e.message, appointmentId: e.appointmentId });
          if (e.code === 'NOT_FOUND') return send(404, { error: e.message });
          send(400, { error: e.message });
        }
      });
      return;
    }

    const emrMatch = url.pathname.match(/^\/api\/v1\/patients\/([^/]+)\/emr$/);
    if (req.method === 'GET' && emrMatch) {
      if (!hasPermission(role, 'emr:read')) return send(403, { error: 'Forbidden' });
      try {
        return send(200, store.getEmr(decodeURIComponent(emrMatch[1])));
      } catch (e) {
        return send(404, { error: e.message });
      }
    }

    const noteMatch = url.pathname.match(/^\/api\/v1\/patients\/([^/]+)\/emr\/notes$/);
    if (req.method === 'POST' && noteMatch) {
      if (!hasPermission(role, 'emr:write')) return send(403, { error: 'Forbidden' });
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        try {
          const note = store.addClinicalNote(decodeURIComponent(noteMatch[1]), JSON.parse(body));
          send(201, note);
        } catch (e) {
          send(404, { error: e.message });
        }
      });
      return;
    }

    send(404, { error: 'Not found' });
  });
}

module.exports = { createBffServer, hasPermission };
