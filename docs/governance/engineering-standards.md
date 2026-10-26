# Shared engineering standards

Status: proposed. Source of product behavior: [planning pack](../README.md); no implementation authorized.

## Architecture and interfaces

Prefer native Swift/SwiftUI and Kotlin/Compose, with a modular monolith backend, subject to feasibility and owner approval. Build explicit boundaries for capture, processing, encryption, transfer, receipt, gallery export and cleanup. Keep platform adapters native and public-API-based; share protocol definitions/test vectors before sharing runtime abstractions. Avoid microservices, generalized frameworks and dependencies without a concrete requirement.

Each boundary documents input/output, state ownership, failure/cancellation behavior, authorization, idempotency, versioning and observability. Server schemas validate untrusted input; database constraints enforce ownership/uniqueness where possible. Network success, object existence and notification acceptance never substitute for recipient acknowledgment. No changes to ciphertext context, recipient binding, expiry or keys without protocol/security review.

Require an ADR for a new platform/library/service affecting trust or operations, a material interface/state transition change, a retention/privacy decision, or a measured scaling change. Routine implementation details within an accepted design need concise rationale, not an ADR per class. ADR acceptance must reference the actual owner approval when required; decisions remain proposed until then.

## Code quality, when development is authorized

- Clear domain names, cohesive modules, narrow interfaces and explicit error/state types. Prefer the simplest design meeting the current acceptance criteria; no speculative abstraction or hidden global state.
- Strict compiler/type checks, platform formatter/linter and static analysis with pinned reproducible versions. Introduce tools only with approved implementation/setup work. Do not disable a rule globally to clear one local failure.
- Typed, versioned contracts at platform boundaries; preserve compatibility for queued photos, persisted state and older deployed clients. Thread/concurrency ownership and crash-recovery behavior are explicit.
- Comments explain intent, trade-offs, invariants or surprising OS/security constraints. Document public interfaces and non-obvious security logic. Avoid paraphrasing syntax or using comments to excuse unclear code.
- Automated tests demonstrate observable requirements, regression causes and failure boundaries. Avoid implementation-mirroring or low-value snapshot churn. No arbitrary coverage percentage substitutes for critical-path tests.
- Dependencies need purpose, alternatives, license/maintenance/security review, transitive impact and update owner. Commit applicable lockfiles/checksums; no unpinned remote scripts, secrets, private photos or generated build clutter.
- Fix the causal defect, remove obsolete paths and keep unrelated refactors out of the change. Never suppress errors to produce a false success state.

Language conventions should follow native idioms: Swift concurrency isolation and nonblocking camera configuration; Kotlin structured concurrency and lifecycle-aware state; strict TypeScript with runtime input validation. Pin actual toolchains and repository-specific commands during authorized foundations; this policy does not invent SDK versions or require an unavailable formatter.

## Privacy, security and safety of data

Treat consent, account/device authorization, key binding and data expiry as application invariants. Use reviewed cryptographic implementations and interoperable test vectors; no custom primitives or security-through-obscurity. The exact suite remains a proposed decision until validated and approved.

Never include keys/tokens, signed storage URLs, photo bytes/thumbnails, unsanitized EXIF or sensitive user identifiers in logs, test fixtures, analytics, prompts or handoffs. Prefer synthetic fixtures; actual photos require explicit consent and a documented retention/access policy. Sanitize crash/trace attachments. Least-privilege credentials stay in platform/managed secret stores, never repository files.

Document trust boundaries and what the OS/host/recipient/provider can still access. Do not claim screenshot prevention, stock-camera parity, immediate physical erasure, instantaneous offline revocation or guaranteed background delivery without evidence—and never where the documented model rules it out. Backup and restore are part of deletion/revocation design.

## Documentation conventions

Every significant behavior/interface/architecture/privacy/operational change updates its owning specification in the same review. Use one authoritative location for each rule; link instead of copying. All records carry status (proposed/accepted/superseded where applicable), date, owner role, evidence and linked decisions. Only actual approved decisions are marked accepted. Keep stable requirement/decision IDs and preserve superseded rationale.

Separate documented platform capability, observed device behavior, proposed targets and assumptions. Cite official source pages beside platform claims, record SDK/OS/device conditions with experiments, and recheck unstable facts when affected work begins. A source citation proves a documented capability, not actual device quality. Illustrative calculations label inputs/units and do not masquerade as measured capacity or current quotes.

Use lowercase descriptive Markdown filenames, repository-relative links and Mermaid for compact architecture/state diagrams. Cross-tool operating files stay short (target ≤45 lines each) and point to these policies. Update the documentation index when adding/removing an authoritative page. Resolve contradictory prose explicitly; do not silently reinterpret terms such as Prepared, Received or Saved to Photos.

When code exists, root/component READMEs must include verified prerequisites, setup/build/run/test commands, configuration variable names without secrets, architecture links and failure troubleshooting. Operational runbooks name trigger, impact, safe diagnosis, mitigation/rollback, verification and accountable owner. An untested procedure is marked unverified and cannot satisfy a release drill gate.

## Capacity, performance and cost

“One billion users” is an ambition, not a capacity claim. Preserve clear partition/ownership boundaries and avoid unbounded queues or scans, but optimize measured bottlenecks rather than hypothetical scale.

Each capacity decision documents workload (active users, photos/user, byte-size distribution, burst factor, retries, concurrency), scenario duration, latency/error percentiles, queue age, resource use and cost per photo/active user. State the tested limit and headroom; do not extrapolate a 1,000-user benchmark into a billion-user guarantee. Do not run paid load tests in planning.

Suggested capacity stages: M0 feasibility on a small device set; alpha validation of the initial PRD workload assumptions; beta ten-times-modeled-peak tests from an approved baseline; launch only within tested headroom. QA/SRE must define and obtain approval for the concrete request/byte/concurrency model before calling a load result a pass. Rebaseline when payload, retry or hardware assumptions change.

Scale the monolith horizontally where useful; introduce a managed queue, partitioning, cache or multi-region component only after profiling demonstrates the problem and an ADR covers operational complexity, failure/deletion semantics and cost. No extra component may compromise consent, key binding or recoverability.
