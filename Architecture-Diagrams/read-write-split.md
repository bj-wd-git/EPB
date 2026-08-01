# Read/Write Split

Read and write workloads behave differently. EPB separates them from the API boundary inward: GET routes to query handlers and read repositories; POST, PUT, PATCH, and DELETE route to command handlers and write repositories. At maturity, read repositories may target replicas or projections without changing the API surface.

**Source:** [read-write-split.mmd](read-write-split.mmd)

```mermaid
flowchart TB
  subgraph api [API_Layer]
    GET[GET_Read]
    WRITE[POST_PUT_PATCH_DELETE]
  end

  subgraph service [Service_Interior]
    Q[Query_Handlers]
    C[Command_Handlers]
  end

  subgraph data [Data_Access]
    ReadRepo[Read_Repositories]
    WriteRepo[Write_Repositories]
    TxDB[(Transactional_Store)]
    ReadDB[(Read_Replica_or_Projection)]
  end

  GET --> Q
  WRITE --> C
  Q --> ReadRepo
  C --> WriteRepo
  ReadRepo --> ReadDB
  WriteRepo --> TxDB
```

## Key Rules

- Commands change state; queries do not
- Side effects (events, notifications, audit) attach to command success only
- List reads require pagination; writes run inside transactional boundaries

## Related Chapters

- [Read/Write Separation](../Volume-1-Foundation/12-read-write-separation.md)
- [Model Separation](../Volume-1-Foundation/11-model-separation.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)
- [Transactional vs Reporting](../Volume-1-Foundation/13-transactional-vs-reporting.md)
