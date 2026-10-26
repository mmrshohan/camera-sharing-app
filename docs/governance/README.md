# Shared engineering governance

Status: **proposed for owner approval; planning only**. Version: draft 1, 27 October 2026.

This is the common policy entry point for Codex, Claude Code and human contributors. The tool entry files contain loading instructions; they do not maintain separate engineering rules. Current user authorization permits preparing these documents and reviewing them, not developing the application.

## Mandatory reading

Before substantive work, read these four core policies once per working context; reread changed policies after an update or lost context:

1. [Constitution](constitution.md): priorities, authority, authorization and change control.
2. [Agent workflow](agent-workflow.md): roles, task planning, model selection, delegation and handoffs.
3. [Engineering standards](engineering-standards.md): architecture, code, privacy, documentation and scale.
4. [Quality gates](quality-gates.md): review, evidence, testing, Git, CI/CD and release.

Also read [repository organization](repository-plan.md) for onboarding/layout changes; [templates](templates.md) when creating task, decision, review, approval or exception records; and [review record](review-record.md) for current gaps and validation status. These links are explicit reading requirements, not automatic recursive imports.

## Authority and ownership map

| Subject | Authoritative location | Change/review owner role |
| --- | --- | --- |
| Engineering priorities and authorization | [Constitution](constitution.md) | Product owner; security/privacy review for affected rules |
| Role/model routing and workflow | [Agent workflow](agent-workflow.md) | Developer Experience/Release Lead |
| Code/architecture/documentation conventions | [Engineering standards](engineering-standards.md) | Relevant principal engineer + architecture reviewer |
| Merge, test and release evidence | [Quality gates](quality-gates.md) | QA Lead + Release Lead; security reviewer where required |
| Product behavior and numeric targets | [Planning pack](../README.md), especially 01/03/04/06/08 | Product owner + affected specialist |
| Repository layout | [Repository plan](repository-plan.md) | Developer Experience/Release Lead |
| Adopted changes | Future numbered ADRs and owner approval records | Owner listed on the decision |

Roles are responsibilities, not claims of credentials. Named people and approvers are not assigned yet. The product owner is the human user; an AI agent cannot sign on their behalf.

The [owner-supplied constitution](source/owner-governance-2026-10-27.md) is preserved verbatim as provenance. The shared policies above operationalize it; the source is not a second independently maintained rulebook. Resolve any discrepancy with the owner instead of silently choosing a weaker requirement.

All product recommendations D01–D15 and thresholds in the planning pack remain proposals. A policy being marked mandatory describes how it should operate after adoption; the existing user-imposed planning gate applies now regardless of draft status. No CI, branch protection, automatic enforcement or cross-tool loading test has been configured or claimed.
