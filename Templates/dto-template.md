# DTO Template

```text
Request DTO:
  - validation attributes
  - no business logic
  - API contract version

Response DTO:
  - no internal IDs unless needed by client
  - nested DTOs for complex shapes
  - pagination wrapper when listing

Transaction Model:
  - business processing input
  - service-internal only

Domain Model:
  - rich behavior
  - invariants enforced

Persistence Entity:
  - database mapping
  - never exposed via API
```

## Mapper Contract

```text
RequestDTO -> TransactionModel -> DomainModel -> Entity
Entity -> ResponseDTO (via mapper, may combine multiple entities)
```
