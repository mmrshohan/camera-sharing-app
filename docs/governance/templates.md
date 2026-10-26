# Small templates for auditable work

Status: proposed conventions. Use only the fields relevant to the artifact; significant work must not omit authorization, risk, acceptance evidence or review. “Unknown,” “not run” and “N/A — reason” are valid, honest values. Do not fill unknowns with invented names, SHAs or model IDs.

## Task plan and agent handoff

```text
Task ID / date / status:
Goal and requirement/decision links:
In scope / out of scope:
Authorization source and exact scope / current phase:
Responsible role / actual actor or session:
Risk class and reason:
Inputs read / artifact or baseline identity:
Model requested / setting:
Availability evidence / what was actually selected and observed:
Tools, permissions, context and hardware limitations:
Plan, dependencies and assigned file ownership:
Assumptions / decisions needing approval:
Acceptance criteria and verification method:
Actual checks: artifact, environment, procedure, counts, result, evidence link:
Files/output changed:
Reviewer identity and independence / findings / resolution:
Remaining risk / blocked checks / next action:
```

For delegated tasks, include the common policy link, stop conditions, whether work is read-only and whether writers share the same workspace. For a session handoff, state queued work and user changes to preserve; do not imply the next agent inherits unwritten context or authority.

## Architecture decision record

```text
ADR NNNN — title
Status: proposed | accepted | superseded
Date / accountable role / author:
Context and requirement IDs:
Options, evidence, uncertainties and trade-offs:
Recommendation / decision:
Security, privacy, UX, reliability, maintenance and cost consequences:
Interface/state/data compatibility and migration/rollback implications:
Validation and release criteria:
Independent review and findings:
Owner approval reference and authorized scope (if required):
Supersedes / superseded by:
Follow-up owner and due milestone:
```

A draft file or green document check cannot make the status accepted. For an already-authorized routine choice, name the existing approval that covers it rather than request duplicate permission.

## Owner approval record

```text
Approval ID / date:
Actual human approver and source message/issue/PR reference:
Approved artifacts/versions or bounded proposal:
Scope: governance adoption | architecture acceptance | M0 | other development | release
Actions/environments/paid commitments explicitly permitted:
Exclusions and prerequisites:
Expiry or milestone boundary:
Recording actor / verification of the source:
```

Use a compact faithful quotation or summary, not a manufactured signature. If approval refers to an older artifact and a material change followed, confirm the changed scope before dependent execution. An AI review does not count as owner approval.

## Pull request / change review

```text
Problem and resulting behavior:
Scope and linked requirement / ADR / authorization:
Risk class, affected platforms/trust boundaries:
Evidence: exact artifact + actual checks/results + device coverage:
UI screenshots/video when relevant and sanitized:
Security/privacy and data-lifecycle effects:
Migration, compatibility, rollout/rollback plan (or justified N/A):
Documentation updated:
Independent reviewers / findings / dispositions:
Known limitations and tracked follow-ups:
```

Review findings name severity, artifact/path/line, concrete failure scenario, impact and required resolution. The coordinator checks actual output, not just a summary. Re-run affected checks after fixes.

## Gate, release and exception record

```text
Gate ID / milestone / reviewed artifact:
Applicable requirements and approved metric definitions:
Check/procedure / environment / exact device or build:
Observed result, counts, time window and exclusions:
PASS | FAIL | BLOCKED/NOT RUN | N/A with rationale:
Evidence links/digests / verifier:
Reviewer/sign-offs and independence:
Unresolved findings / accountable owner / due milestone:
Decision and authorization to advance (or stop):
```

For an exception append: exact rule, necessity, scope, risk, compensating controls, expiry, independent reviewer, explicit owner approval and remediation owner. For a release append: source SHA, app/backend/protocol versions, build provenance/signing checks, store/disclosure checks, rollout cohort/window/minimum samples, halt/rollback procedure and named human sign-offs. A P0/P1 release blocker cannot disappear by adding “exception approved” to an AI-authored record.
