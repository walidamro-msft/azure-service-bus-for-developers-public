# Azure Service Bus for Developers - Trainer Notes

## Delivery Goal

Help developers make defensible messaging architecture decisions and implement a working Service Bus flow using passwordless authentication. The outcome is not merely a deployed namespace: attendees should be able to explain delivery semantics, choose entity settings, diagnose failed processing, and identify the layer that needs scaling.

## Recommended Delivery Shape

- Use **two days** when attendees will complete Labs 1-4. Reserve 90 additional minutes for Lab 5.
- Use the **one-day option** for architecture, demonstrations, and selected exercises.
- Select **one language track** for the live room. Do not switch languages between demonstrations.
- Keep the shared conceptual modules language-neutral, then use the selected SDK reference and lab pages for implementation.
- Use Standard for the core exercises because topics, subscriptions, sessions, and duplicate detection are required. Explain Premium with diagrams and metrics unless dedicated Premium resources are part of the event budget.

## Trainer Table of Contents

1. [Preparation](#preparation)
2. [Opening the workshop](#opening-the-workshop)
3. [Module delivery notes](#module-delivery-notes)
4. [Lab facilitation](#lab-facilitation)
5. [Timing and scope control](#timing-and-scope-control)
6. [Common failures](#common-failures)
7. [Cleanup](#cleanup)
8. [After the workshop](#after-the-workshop)

## Preparation

### One Week Before

- Confirm the delivery format, selected language, attendee count, Azure subscription model, and whether Lab 5 is included.
- Publish the static workshop and review [the invitation](INVITATION.md) before sending it.
- Test the selected language path from a clean machine or development container.
- Confirm attendees can create resource groups, Service Bus namespaces, entities, and role assignments.
- Verify regional availability for Service Bus and any serverless resources used by Lab 5.
- Set a naming convention that avoids collisions, such as `sb-workshop-{{INITIALS}}-{{SUFFIX}}`.
- Decide who pays for resources and communicate the cleanup deadline.

### One Day Before

- Run the full selected path with a non-owner test identity where practical.
- Confirm `az login`, `az account show`, and package restore work on the presentation machine.
- Prepare a completed namespace and applications for fallback demonstrations.
- Open the workshop pages and Azure portal before attendees arrive.
- Keep a plain-text file with the resource group, namespace, queue, topic, and subscription names used in demonstrations.
- Check Azure Service Health and repository deployment status.

### Room and Session Setup

- Display the workshop URL, selected language path, Azure sign-in command, naming convention, and support channel.
- Ask attendees to run `az account show --output table` before creating anything.
- Use separate browser profiles when demonstrating attendee and administrator permissions.
- Increase terminal and editor font sizes before screen sharing.
- Keep the portal and a terminal visible during demonstrations so attendees can connect configuration with observable runtime state.

## Opening the Workshop

Start with three boundaries:

1. Service Bus is a durable message broker, not a retained telemetry stream or a synchronous API.
2. At-least-once delivery means consumers must tolerate redelivery even when duplicate detection is enabled.
3. Scaling has separate broker, topology, and application layers; changing one does not automatically scale the others.

Ask attendees for one workload they are considering. Revisit two or three examples during architecture, topology, and scaling discussions.

Opening checkpoint:

- Can the attendee state whether their producer is sending a command, publishing a fact, or appending to a stream?
- Can they identify who owns completion, retry, and failure recovery?

## Module Delivery Notes

### 1. Introduction

Page: [Introduction](../introduction.html)  
Target: 20 minutes

Emphasize:

- Namespace, queue, topic, subscription, and dead-letter subqueue boundaries.
- PeekLock settlement: complete, abandon, defer, and dead-letter are distinct outcomes.
- TTL controls message usefulness; auto-delete controls entity lifetime.
- A successful send does not mean business processing succeeded.

Demonstration:

- Open a queue in Service Bus Explorer, send one message, peek it, receive it in PeekLock mode, and complete it.

Checkpoint:

- Ask why a lock expiration can produce another delivery and why the handler must be idempotent.

### 2. Architecture Design

Page: [Architecture design](../architecture-design.html)  
Target: 35 minutes

Emphasize:

- Start with communication semantics, then validate payload, delivery, protocol, network, scale, and cost.
- Queue receivers compete; topic subscriptions each receive an independent copy.
- Event Hubs retains a replayable stream, while Service Bus removes messages after settlement.
- Partitioning creates broker-and-store distribution. Premium messaging units provide adjustable namespace capacity. Application processors scale independently.

Demonstration:

- Walk one attendee workload through the decision tree.
- Compare 4 MUs on 1 partition, 2 partitions, and 4 partitions.

Checkpoint:

- Ask which action addresses high namespace CPU, a hot session key, and a healthy namespace with a growing queue. Expected answers: add/test MUs, redesign the key or boundary, and scale/fix consumers respectively.

### 3. SKUs and Tiers

Page: [SKUs and tiers](../skus-and-tiers.html)  
Target: 20 minutes

Emphasize:

- Basic does not support topics and subscriptions.
- Standard provides shared capacity; Premium provides dedicated capacity and advanced network/isolation options.
- Premium cost is provisioned capacity, not a per-operation comparison with Standard.
- Feature, latency, isolation, networking, and payload requirements should drive the tier decision.

Demonstration:

- Use the page calculator to compare a modest Standard workload with one and two Premium MUs.

Checkpoint:

- Ask attendees to name the requirement that forces their tier choice.

### 4. Deploy via Azure Portal

Page: [Deploy via portal](../deploy-portal.html)  
Target: 25 minutes

Emphasize:

- Use a globally unique namespace name and Standard tier for the workshop.
- Capture the fully qualified namespace, not a connection string.
- Entity settings such as sessions, duplicate detection, and partitioning include creation-time decisions.
- Portal deployment is useful for learning and inspection; stable topology belongs in infrastructure as code.

Demonstration:

- Create a namespace and inspect queue/topic creation options without rushing past conditional fields.

Checkpoint:

- Confirm every attendee has selected the intended subscription and region before selecting Create.

### 5. Deploy with Azure CLI and Bicep

Page: [Deploy with Azure CLI and Bicep](../deploy-cli-bicep.html)  
Target: 30 minutes

Emphasize:

- Use `az account show` before deployment and parameterize names and locations.
- Bicep makes creation-time entity settings reviewable and repeatable.
- Role-assignment propagation can take several minutes; repeated immediate failures are not always code defects.
- Use managed identity and data-plane RBAC instead of distributing secrets.

Demonstration:

- Deploy the workshop topology, then compare the resulting portal configuration with the Bicep properties.

Checkpoint:

- Ask which identity sends, which identity receives, and which identity is allowed to administer entities.

### 6. Working with Queues

Page: [Working with queues](../queues.html)  
Target: 45 minutes plus Lab 1

Emphasize:

- `MessageId` identifies one logical message; `CorrelationId` groups a workflow.
- Duplicate detection filters repeated sends, not redelivery after lock loss or abandonment.
- Prefetch and concurrency must fit lock duration and handler latency.
- DLQ monitoring and ownership are part of queue design.

Demonstration:

- Send a message with explicit ID, subject, content type, correlation ID, and application properties.
- Show successful completion and one deliberate abandon/redelivery cycle.

Checkpoint:

- Ask attendees to identify the idempotency key and the expected behavior after a retry.

### 7. Topics and Subscriptions

Page: [Topics and subscriptions](../topics-subscriptions.html)  
Target: 40 minutes plus Lab 2

Emphasize:

- The topic publishes one event; subscriptions hold independent copies and delivery state.
- Every new subscription starts with a default match-all rule unless it is replaced.
- Filter on stable system or application properties, not serialized body fields.
- Adding subscriptions creates additional copies; adding processors to one subscription scales one subscriber capability.

Demonstration:

- Publish one event and receive it from two subscriptions.
- Replace a default rule with a SQL or correlation filter and show a matching and nonmatching event.

Checkpoint:

- Ask whether a new requirement needs another processor or another subscription, and why.

### 8. Advanced Features

Page: [Advanced features](../advanced-features.html)  
Target: 60 minutes plus Labs 3 and 4

Emphasize:

- Sessions provide exclusive ordered processing per `SessionId`, not global FIFO.
- A hot session remains serial regardless of receiver count.
- Scheduling delays availability; deferral hides a message until its sequence number is retrieved.
- Dead-lettering preserves failed-message evidence but requires an owned recovery process.

Demonstration:

- Interleave two session IDs and show ordered processing within each session.
- Dead-letter an invalid message with a useful reason and description, then inspect it.

Checkpoint:

- Ask why blind DLQ replay can repeat an outage and what must be fixed before re-drive.

### 9. Security and Monitoring

Page: [Security and monitoring](../security-monitoring.html)  
Target: 45 minutes

Emphasize:

- Separate Data Sender, Data Receiver, and Data Owner responsibilities.
- Scope roles to the smallest practical namespace or entity.
- Private networking does not replace identity and authorization.
- Alert on failed requests, throttling, backlog age, and DLQ growth, not only resource availability.

Demonstration:

- Show the principal used by `DefaultAzureCredential`, its role assignment, and one relevant metric or alert.

Checkpoint:

- Ask why a producer should not receive Data Owner and why a zero server-error metric does not prove consumers are healthy.

### 10. Administration and Operations

Page: [Administration and operations](../administration.html)  
Target: 50 minutes

Emphasize:

- Start incidents with runtime counts, metrics, logs, and peeking before changing state.
- A growing backlog with healthy namespace capacity usually points to consumers or downstream dependencies.
- Deleting an entity deletes its messages and is not a backlog remedy.
- Promotion, replay, and scaling actions need tested runbooks and observable success criteria.

Demonstration:

- Read queue runtime properties, peek messages, compare active and DLQ counts, and classify a sample incident.

Checkpoint:

- Ask attendees to propose the least destructive next action for a growing backlog.

### 11. Summary

Page: [Summary](../summary.html)  
Target: 10-15 minutes

Have attendees state:

- Their communication contract and selected topology.
- Their idempotency and ordering keys.
- Their DLQ owner and recovery approach.
- The metrics that distinguish broker pressure from consumer pressure.
- The first production-hardening change they will make.

## Lab Facilitation

### Select One Language

- [.NET](../languages/dotnet.html)
- [Java](../languages/java.html)
- [JavaScript/TypeScript](../languages/javascript.html)
- [Python](../languages/python.html)

Keep attendees on the same numbered lab even if they use different languages. The scenario and checkpoints are equivalent across tracks, but commands and project layouts differ.

### Lab 1 - Queue-Based Order Intake

Time box: 60 minutes

Success criteria:

- The producer and receiver run as separate processes.
- Authentication uses `DefaultAzureCredential` and the namespace hostname.
- The receiver completes a valid message and can explain the settlement operation.

Pause points:

- 15 minutes: namespace, queue, and RBAC should exist.
- 35 minutes: producer should send successfully.
- 50 minutes: receiver should settle the message.

### Lab 2 - Topic Fan-Out

Time box: 60 minutes

Success criteria:

- One published event reaches both subscriptions.
- Each subscriber has independent delivery state.
- A filter accepts the intended event and excludes a nonmatching event.

### Lab 3 - Session-Ordered Fulfilment

Time box: 60 minutes

Success criteria:

- The queue is session-enabled at creation.
- Interleaved orders retain order within each session.
- Multiple sessions can be processed concurrently without processing one session concurrently.

### Lab 4 - Dead-Letter Recovery

Time box: 60 minutes

Success criteria:

- The invalid message reaches the DLQ with diagnostics.
- The recovery tool preserves identity and correlation context where appropriate.
- The replacement send succeeds before the original DLQ message is completed.

### Lab 5 - Serverless Integration

Time box: 90 minutes; treat as optional or an extension session.

Success criteria:

- Azure-hosted components use managed identity.
- The HTTP-to-queue-to-workflow path reaches storage.
- Load testing produces observable Service Bus and application metrics.

## Timing and Scope Control

If the room falls behind:

1. Use the prepared deployment instead of waiting for new resource provisioning.
2. Demonstrate one language while attendees inspect their equivalent page.
3. Keep Labs 1, 2, and 4; make Lab 3 a demonstration if ordered processing is not central to the audience.
4. Move Lab 5 to an optional follow-up because it introduces several services beyond Service Bus.
5. Never remove the cleanup, identity, idempotency, or DLQ ownership discussion to recover time.

## Common Failures

| Symptom | Likely cause | Trainer response |
|---|---|---|
| `Unauthorized` immediately after RBAC assignment | Role propagation delay or wrong signed-in identity | Confirm `az account show`, inspect the principal, wait briefly, and retry without changing credentials. |
| Namespace name unavailable | Service Bus namespace names are globally unique | Add attendee initials and a short random suffix. |
| Topic creation unavailable | Basic tier namespace | Recreate with Standard or Premium. |
| Session message rejected | Missing `SessionId` or non-session-aware client | Confirm entity settings, message metadata, and receiver type. |
| Message repeatedly returns | Handler abandons it, loses its lock, or never completes it | Inspect logs and delivery count; reduce work, renew the lock, or fix settlement. |
| Filter appears ineffective | Default match-all rule still exists or property type/casing differs | Inspect all rules and application-property names, types, and casing. |
| One session is slow while processors are idle | Hot session key | Explain that one session is exclusive and serial; redesign the key or workflow boundary. |
| Backlog grows with healthy namespace metrics | Consumer or downstream bottleneck | Inspect handler latency/errors before adding MUs. |
| Throughput does not improve after adding MUs | Hot partition, client, entity, or downstream limit | Profile end to end and validate partition-key distribution. |
| Localhost page is unavailable | Static server stopped or wrong working directory | Open `docs/workshop/index.html` directly or restart the approved static host from `docs/workshop`. |

## Cleanup

Reserve at least 10 minutes.

Attendee cleanup:

1. Confirm no workshop resources are shared with another attendee.
2. Delete the workshop resource group.
3. Verify deletion completed and no separately created resource remains.
4. Remove local environment variables, downloaded settings, and temporary files that contain identifiers.

Trainer cleanup:

- Remove prepared fallback resource groups when they are no longer needed.
- Review unexpected costs, orphaned role assignments, and failed deployments.
- Preserve only anonymized screenshots or logs approved for workshop improvement.

## After the Workshop

- Send the workshop URL, selected language references, and any agreed follow-up exercises.
- Record modules or labs that exceeded their time boxes.
- Capture recurring setup failures separately from content misunderstandings.
- Update the invitation when prerequisites, URLs, or supported runtime versions change.
- Re-run the selected path after material Azure portal or SDK changes.
