# ADR-006: Notification — Event-Driven Delivery

## Status

Accepted

## Context

When each application service implements its own notification logic — email templates, SMS providers, delivery tracking, retry policies — the platform accumulates duplicated channel integrations, inconsistent template management, and tight coupling between business workflows and delivery infrastructure. A failed SMS provider should not block a resource approval transaction.

Notifications are a platform concern, not an application concern. Applications know *what happened*; the platform knows *how to deliver*.

## Decision

Applications publish notification events; the platform delivers messages:

- Application services emit domain events (e.g., `ResourceApproved`, `PasswordResetRequested`) to the Event Bus after committing their own transactional work
- The Notification Platform subscribes to events, resolves templates (platform default + tenant override), routes to the correct channel, and tracks delivery status
- Application services never call email, SMS, push, or WhatsApp providers directly
- Notification delivery failures are handled, retried, and monitored by the platform — not by application code

Business logic publishes events; the Notification Platform prepares and delivers the final message.

## Consequences

**Positive:**
- One notification implementation for all applications and channels
- Business transactions decoupled from delivery latency and provider failures
- Centralized template management with tenant overrides
- Consistent delivery tracking, retry, and observability across the platform

**Negative:**
- Eventual delivery — notifications arrive after the triggering transaction commits
- Applications must define meaningful event schemas for the Notification Platform to consume
- Debugging requires tracing across event bus and notification service logs

## References

- [Platform First Design](../Volume-1-Foundation/36-platform-first-design.md)
- [Engineering Principles](../Volume-1-Foundation/35-engineering-principles.md)
- [Notification Platform](../Volume-2-Platform-Services/15-notification-platform.md)
- [Event Bus](../Volume-2-Platform-Services/30-event-bus.md)
