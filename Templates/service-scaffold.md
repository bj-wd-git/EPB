# Service Scaffold Template

Use when creating a new platform or application service.

## Directory Layout

```text
services/{service-name}/
├── api/
│   ├── controllers/
│   └── routes/
├── domain/
│   ├── models/
│   └── services/
├── persistence/
│   ├── entities/
│   └── repositories/
├── mappers/
├── events/
│   ├── publishers/
│   └── handlers/
├── config/
└── tests/
    ├── unit/
    └── integration/
```

## Checklist

- [ ] Service owns its database
- [ ] Request/Response DTOs defined
- [ ] Mappers between layers
- [ ] Standard error responses
- [ ] Audit events on mutations
- [ ] Health check endpoint
- [ ] API documented
