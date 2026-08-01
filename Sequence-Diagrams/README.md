# Sequence Diagrams

Cross-service interaction flows for key EPB platform capabilities.

| Diagram | Description |
|---------|-------------|
| [Notification Flow](notification-flow.md) | Application event → Template Engine → channel delivery |
| [Scheduler Flow](scheduler-flow.md) | Cron job → queue → worker → target service with retry |
| [Roster Flow](roster-flow.md) | Booking → conflict detection → reminder notification |

## Related

- [Architecture Diagrams](../Architecture-Diagrams/)
- [Notification Platform](../Volume-2-Platform-Services/15-notification-platform.md)
- [Scheduler Platform](../Volume-2-Platform-Services/17-scheduler-platform.md)
- [Roster Platform](../Volume-2-Platform-Services/18-roster-platform.md)
