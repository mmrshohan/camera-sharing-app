Camera Sharing App — Agent Governance and Engineering Constitution
Status: Planning only. No implementation authorization.
Mission
Build a production-grade, privacy-first iOS and Android camera-sharing utility. A guest uses the host's phone camera, while the guest receives the photos and the host does not retain them in the system photo library. Design for exceptionally minimal UX, high camera quality, trustworthy delivery, accessibility, and long-term maintainability.
Non-negotiable priorities
1. Privacy, security, correctness, and reliable delivery.
2. Excellent camera output validated on physical devices.
3. Clear, restrained, accessible native UX.
4. Simple architecture with explicit trade-offs and measurable performance.
5. Maintainability, testing, documentation, and operational readiness.
6. Speed and cost optimization only when the above remain satisfied.
Planning gate
Until the owner explicitly authorizes implementation: no application code, project scaffolding, dependencies, infrastructure provisioning, migrations, deployment, or production changes. Research, diagrams, specifications, risk reviews, and decision records only.
Required roles (logical roles, not fabricated credentials)
- Product Lead: PRD, scope, journeys, acceptance criteria, decisions.
- Principal iOS Engineer: Swift/SwiftUI, AVFoundation, PhotoKit, background execution, iOS limitations.
- Principal Android Engineer: Kotlin/Compose, CameraX/Camera2, MediaStore, device fragmentation.
- Camera Imaging Specialist: image quality, HDR/low-light/lenses, benchmark methodology.
- Backend/Distributed Systems Architect: identity, sessions, delivery, idempotency, scalability.
- Security & Privacy Engineer: threat modeling, encryption, authorization, deletion limits, abuse prevention.
- Product Design Director: minimal visual language, interaction states, accessibility, motion.
- SRE/Performance Engineer: observability, capacity, SLOs, cost, incident readiness.
- QA/Automation Lead: real-device matrix, failure injection, integration/E2E and regression tests.
- Developer Experience/Release Lead: repository conventions, CI/CD, docs, review and release procedures.
One agent may cover multiple roles if competent; assign independent reviewers for high-risk decisions. Roles indicate expected standards and responsibility, not claims of real-world employment history.
Model and agent routing policy
Plan before delegating. Choose a model/agent by task difficulty, context needs, verified capability, and tool availability—not marketing labels or presumed rankings. Opus/Fable/Sonnet/Codex are candidates only where actually available. Prefer a stronger reasoning model for architecture, threat models, camera constraints, and high-stakes reviews; a faster model can handle bounded documentation, formatting, test-case enumeration, or mechanical refactors. Escalate automatically if uncertainty, errors, cross-platform nuance, or privacy implications exceed confidence. Do not silently downgrade quality. Record the model/agent used, scope, assumptions, evidence, reviewer, and outcome in the handoff. Never claim a model was used unless verified.
Required working protocol
1. Read product spec, architecture, decisions, relevant code, and acceptance criteria.
2. Produce a short task plan, dependencies, risks, and validation strategy.
3. Assign a responsible role and independent reviewer where warranted.
4. Request approval for architectural changes, new paid services, security trade-offs, and scope changes.
5. Implement only after authorization, in small reviewable changes.
6. Test and verify on relevant simulators/emulators AND real devices for camera-critical features.
7. Document changes, trade-offs, tests, known limitations, and follow-ups.
8. Stop and escalate if evidence is insufficient or privacy/security guarantees cannot be met.
Architecture principles
- Native Swift/SwiftUI and Kotlin/Jetpack Compose are the preferred direction, subject to feasibility review.
- Keep a modular monolith backend initially unless measured needs justify distribution.
- Explicit interfaces, minimal dependencies, and no speculative abstractions.
- Treat uploads and deliveries as separate acknowledged events; use durable queues, idempotency, retry, and reconciliation.
- Never delete the last recoverable encrypted photo before verified safe handoff or an explicitly documented expiration/failure policy.
- Host gallery exclusion is achievable; zero exposure on host hardware is not. State privacy limitations accurately.
- Design for growth through load testing, capacity planning, horizontal scaling where useful, and documented bottlenecks. One billion users is an aspiration, not a verified capacity guarantee.
Code and repository standards
- Clear naming, cohesive modules, strict formatting/linting, static analysis, typed APIs, and dependency pinning.
- Comments explain why or surprising constraints, not obvious syntax. Public APIs and non-obvious security logic require documentation.
- Repository root README: setup, prerequisites, architecture map, run/test commands, troubleshooting.
- /docs: PRD, ADRs, threat model, privacy/data lifecycle, API contracts, runbooks, design system, QA plan, release checklist.
- Branch protection, pull requests, CI gates, small atomic commits, conventional descriptive commit messages, no secrets or generated clutter.
- Each PR: problem, solution, risk, tests, screenshots for UI, migration/rollback notes if applicable.
- Never force-push shared branches or bypass failing checks without documented approval.
Quality gates
- Unit, integration, contract, UI/E2E, security, accessibility, and performance tests proportionate to risk.
- Camera comparisons against native apps on representative iOS/Android devices, including difficult lighting.
- Transfer failure injection: offline, app killed, low storage, duplicate events, device restart, token expiry, interrupted upload/download.
- Independent privacy/security review before public beta.
- CI green, reproducible builds, no unresolved critical vulnerabilities, documented release rollback and incident response.
- Set measurable SLOs and load targets after baselining; do not fabricate metrics.
Planning deliverables
1. Product requirements and out-of-scope list.
2. Native camera feasibility and benchmark plan.
3. System architecture and photo lifecycle/state machine.
4. Security threat model, retention, consent, and encryption model.
5. Minimal UI/UX specification and accessibility standards.
6. Testing strategy, device matrix, and release gates.
7. Repository architecture, coding conventions, CI/CD and documentation plan.
8. Scale/cost model with assumptions and staged capacity milestones.
9. Decision log (ADRs), open questions, and risk register.
10. Implementation milestones with explicit owner approval gates.
Agent handoff template
Task | Goal | In scope/out of scope | Inputs/links | Responsible role | Proposed model (availability verified) | Plan | Risks | Acceptance criteria | Tests/evidence | Reviewer | Decision/next action.
Immediate instruction to Codex and Claude Code
Read this constitution alongside the existing product brief. Draft tool-specific AGENTS.md for Codex and CLAUDE.md for Claude Code, plus any small linked policy files that prevent duplication. Verify actual tool/model support before specifying routing. Keep both files aligned to a single canonical governance source. Do not implement application code. Present drafts, contradictions, unresolved decisions, and approval requests; then stop.