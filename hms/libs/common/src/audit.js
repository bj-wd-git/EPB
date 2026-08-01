/**
 * Immutable audit event publisher — ADR-012
 */
function createAuditPublisher(store = []) {
  return {
    publish(event) {
      const entry = {
        id: `audit-${store.length + 1}`,
        actorId: event.actorId,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId,
        branchId: event.branchId,
        timestamp: event.timestamp || new Date().toISOString(),
      };
      store.push(Object.freeze(entry));
      return entry;
    },
    list() {
      return [...store];
    },
  };
}

module.exports = { createAuditPublisher };
