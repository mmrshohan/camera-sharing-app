# Review, testing, Git, CI/CD and release gates

Status: proposed controls, not configured enforcement. Planning-document checks apply now; application gates await explicit implementation authorization.

## Evidence rules and severity

For every applicable gate record: artifact ID (commit SHA when Git exists, file hashes otherwise), environment/toolchain, check/command or device procedure, observed result, counts/duration, sanitized output/artifact location, verifier and unresolved limitations. Results are **PASS**, **FAIL**, **BLOCKED/NOT RUN**, or **N/A with rationale**. Skipped, unavailable, flaky and approval-needed checks are not PASS. Coordinator verifies reviewer claims against the actual artifact. New relevant changes invalidate earlier affected checks.

Severity: P0 active/credible privacy breach or data loss requiring immediate containment; P1 security/correctness/recoverability defect blocking the milestone/release; P2 material nonblocking defect requiring owner, scope and due milestone; P3 minor improvement. All validated critical/high security vulnerabilities, unauthorized delivery, host-library leakage, exposed keys, false-success states and silent photo loss are P0/P1 blockers regardless of averages. Uncertain plausible high-impact findings remain blocked pending validation; an author cannot dismiss them alone.

## Gate matrix

| Gate | Trigger / accountable role | Required measurable exit evidence |
| --- | --- | --- |
| G0 — Authorization and task plan | Every task; coordinator | Explicit scope/authorization reference, risk class, accountable role, acceptance checks and review plan; 0 actions beyond authorization |
| G1 — Documentation consistency | Documentation changes; DX Lead + relevant specialist | 0 missing required pages, broken local links/imports or unmatched fences; both entry files ≤45 lines; 0 unresolved material policy contradictions; proposed/approved states preserved. Governance/behavior edits get R2/R3 review |
| G2 — Change review | Every code PR; relevant principal | Actual diff inspected, R-class reviewer assigned, 0 unresolved P0/P1, all comments dispositioned; R2/R3 independent review complete and required owner decisions recorded |
| G3 — Automated correctness | Every code PR; QA + implementer | Applicable format/lint/type/build/unit/integration/contract checks pass on reviewed artifact; 0 unexplained failures or unbounded flaky reruns; tests exercise changed behavior and failure cases |
| G4 — Mobile and camera | Camera, lifecycle, permissions or UI change; mobile/QA leads | Affected simulator/emulator flows plus relevant physical-device cases pass; exact device/OS/build and repeat counts recorded. Camera quality/host-library gates from 04/FR-03 exercised when affected; no simulator-only quality sign-off |
| G5 — Privacy/security/reliability | R3 change and before public beta; independent specialists | Threat model/protocol and negative authorization tests current; all changed invariants covered; 0 unresolved critical/high vulnerabilities or P0/P1; independent review findings and fixes verified |
| G6 — Beta evidence | Beta exit; QA/SRE/product | Approved PRD/camera/lifecycle targets met with denominators, exclusions, counts and device coverage; accessibility/usability gates passed; unresolved gaps block promotion |
| G7 — Reproducible release and operations | Store submission/production; Release + SRE/security | Source SHA/protocol/toolchain/lockfiles identified, clean builds pass, signatures/provenance verified, tested rollback/restore/incident plans, store/privacy/deletion disclosures current, named humans approve release |
| G8 — Rollout and follow-up | Each rollout step; release owner | Approved cohort/window/sample and health metrics observed; no P0/P1; halt/rollback thresholds evaluated; pending transfer compatibility and post-release support ownership verified |

G0/G1 are executable as document review now. G2–G8 are future gates, **not run** for a nonexistent app. Documentation-only work may mark application tests N/A, but cannot mark a future release gate green. No placeholder workflow or empty status check counts as enforcement.

## Risk-based test selection

| Changed area | Minimum relevant checks |
| --- | --- |
| Authorization/pairing/device keys | Wrong user/device, expired/replayed invitation, key substitution, concurrent approval, revoked account/device and stale grant; reviewed protocol vectors |
| Capture/processing/format | Actual lenses/modes, main/front, orientation/color/dimensions, difficult light, metadata sanitation, interruption/thermal/backpressure and host library exclusion |
| Delivery/persistence/cleanup | Offline, lost responses, duplicate/out-of-order events, expired tokens/grants, interrupted upload/download, OS kill, force-quit/force-stop, reboot before unlock, disk full, expiry and cancel/receipt races |
| Gallery/library export | Permission denial/revocation, low storage, crash at OS-save/local-commit boundary, duplicate prevention and explicit uncertain status |
| Accessible/native UX | VoiceOver/TalkBack, largest text, contrast/targets, reduced motion, focus restoration and truthful error/loading/empty states on affected flow |
| Backend/schema/operations | Transaction/constraint failures, rollback compatibility, outbox retry, restore with current deletion/revocation journal, load/cost and failure monitoring |

Add tests proportionate to impact; an R0 wording/link fix does not need an app test suite. A behavior-changing documentation edit needs semantic review even if link checks pass. Security-critical patches require regression evidence against the defect and independent verification. Unavailable hardware blocks the relevant gate; document it rather than substitute emulator confidence.

## Existing proposed numerical gates

The authoritative values remain in [01](../01-product-requirements.md), [04](../04-camera-engineering.md), [05](../05-ui-ux-design.md) and [06](../06-photo-lifecycle-reliability.md). Examples include the 1,000-capture/platform host-library check, 10,000-photo cross-platform fault campaign, 1,000-session beta crash sample, camera latency/quality targets and the real 72-hour soak. These are **proposed acceptance targets, not achieved metrics**. Obtain baseline/owner acceptance before implementing pass/fail automation; governance adoption alone does not accept every number. Any change to a target requires evidence and an approved decision; never lower a threshold to hide failure.

Before a release gate uses a metric, define its event/inclusion rules, device/OS/network cohort, denominator, time window and minimum sample in the release test plan. Reuse the stated counts above; QA/product must resolve unstated denominators (for example API availability probes and modeled peak load) before a pass can be asserted. Synthetic successes and excluded failures must be reported separately. Independent review checks that eligibility rules do not remove the failure being tested.

## Git and pull requests — future configuration

Do not initialize Git during planning. Once authorized, propose `main` as protected/trunk branch, short-lived task branches and small atomic commits. Use descriptive Conventional Commit-style subjects (for example `docs: clarify receipt boundary`); no secrets or unrelated changes. Avoid squashing away important decision/evidence records. Preserve user changes; never reset or force-push shared branches. Rewriting private branch history still requires coordination with anyone using it.

Every PR uses the [template](templates.md): problem/result, scope, linked requirement/ADR, risk, tests/evidence, relevant UI images with consent/sanitization, limitations and migration/rollback notes or justified N/A. Do not require UI screenshots for a documentation-only change. Governance entry/shared-policy changes are reviewed together.

Configure required status checks on every PR, including docs-only paths; a dispatcher can select affected suites but must positively report applicability and fail on unknown skipped dependencies. Require at least one independent reviewer for code; R2/R3 add domain/security review as applicable. Stale approvals are dismissed after relevant changes; required checks run on the merge candidate or equivalent tested merge commit. Disallow unreviewed direct pushes, check bypasses and self-approval. Hosting/plan limitations require an explicit equivalent manual control; do not claim branch protection until inspected and verified.

## CI/CD plan — not installed

During authorized foundations, choose repository hosting/CI, then pin runner images, toolchains and third-party actions by immutable reference where supported. Use Linux for backend/Android checks where sufficient and a compatible macOS/Xcode runner for iOS; physical devices remain a separate linked evidence lane. CI must run actual commands documented in component READMEs, not guessed task names.

PR stages: instruction/docs applicability → secret/dependency/license scan → format/lint/static/type checks → component builds/tests → affected integration/contract/UI checks → required artifact review. Untrusted fork PRs receive no signing/production credentials and cannot trigger privileged publishing. Use minimal workflow permissions, isolated credentials and reviewed artifact provenance.

Only approved protected-source artifacts may reach staging or signing. Separate build/test from privileged release jobs; store secrets in managed vaults, use short-lived workload identity where available, and restrict signing to approved protected environments. Reproduce build inputs and compare payloads/test results; do not demand byte-identical signed binaries where signing timestamps make that inappropriate. Keep an SBOM/dependency inventory and sanitized evidence retention policy. Exact CI provider/toolchain/workflow files await authorization.

## Release, rollback and exceptions

Independent privacy/security review is required before public beta. Before public release, accountable human product/release and security/QA sign-offs must be named; AI review supports them and cannot impersonate them. Any absent required sign-off is BLOCKED. Verify store policies/target SDKs, privacy labels/Data safety, account deletion, support and abuse handling against the actual final app.

Rollback must be rehearsed: disable new sessions safely, maintain queued-media protocol compatibility and grant/deletion rules, roll backend artifacts back where compatible and use store halt/forward-fix mechanisms for mobile. Do not promise instantaneous removal of installed mobile binaries. Rehearse DB restore using the independent current deletion/revocation journal; no grants while state is unverifiable. Record drill artifact, observed recovery and remaining gaps.

Normal gate failures are fixed and rerun. A proposed exception needs the [exception record](templates.md), explicit owner approval, accountable reviewer, expiration and compensating control; no agent may disable checks or waive a release blocker on its own. Branch protection must not be bypassed merely because CI is inconvenient. Emergency containment follows a preapproved incident runbook; when none exists, seek scoped authorization and use safe read-only diagnosis meanwhile.
