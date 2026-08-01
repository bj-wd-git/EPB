# ADR-004: Read/Write Separation

## Status

Accepted

## Context

Read and write workloads behave differently. Writes enforce invariants, touch multiple tables, emit events, and require transactional consistency. Reads scan large datasets, apply filters, sort, paginate, and often tolerate slightly stale data. When both share identical code paths, query optimizations compete with write safety — and heavy read queries degrade CRUD latency.

Without an explicit split, teams optimize for one workload at the expense of the other, and the foundation for transactional/reporting path isolation never materializes.

## Decision

EPB separates read and write concerns from the API boundary inward:

- **GET** requests route through query handlers optimized for reads
- **POST, PUT, PATCH, DELETE** requests route through command handlers optimized for writes
- Services structure use cases as commands (writes) and queries (reads), even before infrastructure splits onto separate databases
- Read and write repositories are distinct interfaces; at maturity, read repositories may target replicas or reporting stores without changing the API surface

HTTP method semantics align with operation type. Mixed read-write endpoints are avoided.

## Consequences

**Positive:**
- Read and write paths can be optimized independently
- Foundation for CQRS and read-replica routing without API changes
- Clearer service interior structure — commands vs queries
- Heavy read traffic does not contend with write transactions in the same code path

**Negative:**
- Duplicate repository interfaces until physical store separation is implemented
- Slightly more boilerplate than a single unified data access layer
- Developers must choose the correct handler type for each endpoint

## References

- [Read/Write Separation](../Volume-1-Foundation/12-read-write-separation.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)
- [Transactional vs Reporting](../Volume-1-Foundation/13-transactional-vs-reporting.md)
