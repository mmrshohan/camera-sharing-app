# Camera Sharing App — Planning Pack

Prepared 27 October 2026. **Planning only. Development requires explicit approval.**

Start with the executive recommendation and approval package in [08](08-decisions-open-questions.md), then review the product requirements and architecture. The initial workspace was empty; these documents describe a proposed product, not an existing implementation.

1. [Product Requirements Document](01-product-requirements.md)
2. [Technical Architecture](02-technical-architecture.md)
3. [Privacy & Security Specification](03-privacy-security.md)
4. [Camera Engineering Specification](04-camera-engineering.md)
5. [UI/UX Design Specification](05-ui-ux-design.md)
6. [Photo Lifecycle & Reliability](06-photo-lifecycle-reliability.md)
7. [Delivery Roadmap](07-delivery-roadmap.md)
8. [Decisions & Open Questions](08-decisions-open-questions.md)

[Shared engineering governance](governance/README.md) defines the proposed common operating standards for Codex, Claude Code and human contributors. Governance adoption and implementation authorization are separate decisions.

## Reading conventions

Confirmed requirements come from the supplied brief. Recommendations, thresholds, costs, retention windows and schedules are proposals. Documented API capability does not establish actual device performance. Camera/device behavior, cryptographic interoperability and background execution require the explicitly approved feasibility work. No mockups, application code, dependencies or infrastructure were created.

Official sources are linked alongside relevant claims. Research was checked during this planning session; the platform submission requirements and latest stable SDK/API details must be rechecked at implementation and release. Illustrative cost arithmetic is not a vendor quote.

## Core policy baseline

One host and one designated recipient device per session. No app-created host system-library assets. Native processed still capture, no deferred host PhotoKit proxy workflow. Device-bound encrypted media with no server key escrow. Durable app receipt and successful system-library save are separate states. Cloud access ends at reservation +72h or earlier on receipt/cancellation; host queue expires at capture +72h. Online authorization is required for upload reservation; offline unreserved captures require renewed consent if their session ends. Ending a session preserves already reserved transfers and permits their grant renewal until absolute expiry; cancellation/revocation blocks new grants. Offline recovery uses a separately signed approval of unchanged original photo context. Revocation cannot recall copied photographs or guarantee immediate action on offline devices.
