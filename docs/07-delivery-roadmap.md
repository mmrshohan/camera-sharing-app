# 07 — Delivery Roadmap

Status: planning only. All development milestones below require explicit development authorization. Date: 27 October 2026.

## Staffing and estimate basis

Plan for one experienced iOS engineer, one experienced Android engineer, one backend engineer, a product designer at roughly half time, QA building to full time during integration, and a part-time independent security reviewer. One person covering all disciplines will take materially longer. Proposed range is **24–32 calendar weeks from authorization** for a controlled public release, assuming staffing, physical devices, store accounts and prompt decisions. This is a capacity estimate, not a promised launch date; unexpected camera quality, device quirks or review requirements can extend it.

Milestone ranges overlap where prerequisites permit; they are not additive fixed sprints. Re-estimate after M0 and private alpha. Do not fund the entire feature scope as a certainty before proving camera feasibility.

## Milestones and exit gates

| Milestone | Indicative window | Work and dependency | Evidence required to exit |
| --- | --- | --- | --- |
| M0 — Camera and platform feasibility | Weeks 1–3 | Requires planning/development approval. Minimal disposable native capture experiments; no production infra. Validate host-library-free output, main/front quality, canonical formats, locked-device key access and native transfer scheduling | Physical-device comparison report for older iPhone, modern high-resolution iPhone, Pixel, Samsung flagship and midrange; representative background/force-stop results; measured gaps; go/no-go on supported devices and modes |
| M1 — Foundations, authentication and account setup | Weeks 3–6 | M0 go decision. Establish native app structure, durable journals, backend monolith, managed DB staging, provider login, device keys and deletion flows | Provider token/nonce/audience rejection tests; identity-linking safeguards; device revocation; account deletion proof; observability without sensitive content |
| M2 — Secure pairing and protocol | Weeks 5–8 | M1 account/device identity. QR, exact username requests, bilateral approval, transcript/key binding, leases, block/report and rate limits. Crypto interoperability specification and vectors | Replay, wrong device, expired invitation, key substitution and concurrent approval tests pass; reviewer approves protocol before real-user photos |
| M3 — Capture-to-receipt vertical slice | Weeks 8–12 | M0 output decision + M2 session/crypto gates. Private encrypted capture, storage grants, checksums, outbox, download, local app persistence and receipt-triggered cleanup | All four platform directions work on physical devices; integrity and recipient identity verified; no host-library assets; upload alone cannot mark delivered |
| M4 — Gallery, library saving and recovery | Weeks 11–16 | M3 pipeline. Recipient gallery, add-only/owned-media export, uncertain export states, queue limits, background retry, interruption reconciliation and TTL | Storage/permission denial and kill/reboot matrix passes; duplicate app-record tests; ambiguous OS saves handled honestly; 72-hour soak and cleanup checks |
| M5 — Product polish and security hardening | Weeks 15–20 | Stable M3/M4 flows; design iteration may start earlier. Accessibility, localization decisions, threat-model verification, backup leakage audit, penetration review, restore/on-call drills | Critical/high security findings closed; no wrong-recipient or silent-loss defects; accessibility flows complete; restore does not resurrect deleted access |
| M6 — Cross-platform QA and private beta | Weeks 19–25 | M4/M5 release candidate. Full device/network matrix, 10,000-photo fault campaign, 1,000-session beta sample, service/cost observations and moderated paired-user tests | PRD/quality/lifecycle metrics met; ≥2 weeks stable observation after last material fix; bounded cost and no unresolved P0/P1 defects |
| M7 — Store review and staged public launch | Weeks 24–32 | M6 gates; privacy/deletion policies and support ready. TestFlight/Play testing, review credentials/two-device instructions, store disclosures, signing and staged release | Store approval, operational ownership, incident rollback drill and target API/SDK compliance; monitored rollout with defined halt thresholds |

## Critical path and release blockers

Use the canonical P0–P3 severity definitions in [shared quality gates](governance/quality-gates.md). The earlier “severity-1/2” wording meant critical/high blocking defects; these map to P0/P1 here. Tracked P2 issues are not those high-severity blockers and require an owner and due milestone. This terminology alignment does not approve the proposed release plan.

M0 host-library-free camera feasibility → device identity/crypto protocol → approved pairing → cross-platform encrypted transfer → durable receipt and export recovery → security/fault testing → beta evidence → store review.

Camera work and initial identity work can overlap only after the M0 experiment design is approved; avoid building an elaborate backend before camera risk is understood. Accessibility/content design can proceed alongside engineering once flows are agreed. Hardware procurement, Apple/Google developer enrollment, identity-provider configuration, region selection and reviewer booking are early dependencies.

Stop launch for any unauthorized delivery, recipient-routing ambiguity, exposed content key, host-system-library write in a borrowed session, reproducible silent loss of a prepared photo within retention, unresolved crash loop or misleading delivery/save status. Do not bury these under average success rates.

## M0 recommendation: first authorized development milestone

Approve **a three-week, capped feasibility milestone only**, followed by a review. Its output is evidence, not a production app.

1. Establish the small physical-device set and reproducible daylight/indoor/low-light scenes; record stock-camera baselines.
2. Measure native processed still capture without host PhotoKit/MediaStore writes; compare quality, resolution, latency, metadata sanitation and sustained-session thermal behavior.
3. Test encrypted file preparation and platform scheduling with non-sensitive synthetic media, including locked state, kill, force-stop and reboot. A minimal local/test endpoint is sufficient if explicitly included in M0 authorization; no production infrastructure.
4. Produce interoperable envelope test vectors and a library/API feasibility recommendation; cryptographic review precedes any sensitive-user-photo trial.
5. Present a go/no-go report: supported configurations, quality deficits, format choice, attainable timings, revised cost/staffing estimate and the next funding gate.

M0 exit does not automatically authorize production development. If native output is materially unacceptable on target devices, show the evidence and recommend device/mode restriction or a product change before continuing.

## Release preparation and operations

Prepare clear privacy policy and terms, support contact, abuse handling, account-deletion web resource, Apple privacy labels, Play Data safety declaration and required SDK privacy disclosures. Audit every SDK's collection and backup behavior; no advertising SDKs are needed. Assess encryption/export-compliance declarations with the actual final cryptography and distribution regions. Real-world identity, copyright and consent language require appropriate legal review rather than architectural claims.

Apple requires in-app account deletion for apps offering account creation, and its login-service rules must be assessed for the chosen login options. Google requires both an in-app deletion path and a web deletion request resource. [Apple review guidelines, 4.8 and 5.1.1](https://developer.apple.com/app-store/review/guidelines/), [Google account deletion](https://support.google.com/googleplay/android-developer/answer/13327111).

At this planning date, the official Play target-API page states API 36 or higher for new phone apps/updates from 31 August 2026. Recheck immediately before submission; the roadmap extends beyond this date and policy/SDK requirements can change. Check Apple's then-current submission SDK requirements as well rather than freezing a future assumption. [Google target API policy](https://support.google.com/googleplay/android-developer/answer/11926878).

Provide reviewers two accounts, pairing instructions and a way to exercise both roles; explain why host library access is absent and notification denial remains usable. Review private-sharing abuse-report expectations against actual functionality; E2EE is not a blanket exemption. If user-supplied evidence is needed for reports, design explicit consent separately; do not introduce hidden server decryption.

Propose a staged rollout of small cohorts, then 5%, 25% and full release where store tooling permits. Halt on any security/photo-loss incident, crash-free sessions below 99.8%, or delivery success below the PRD target across a meaningful cohort. Inspect cohort sizes and network eligibility before conclusions. Rollback must preserve pending transfer compatibility and may disable new sessions while existing deliveries recover.

## Ongoing maintenance

Budget monthly OS/device regression, dependency/security updates, storage-cost review, retention audit and support analysis. Repeat the camera baseline when OS/firmware or camera library changes. Test new stable major OS versions before declaring support; respond quickly to store policy deadlines. Quarterly restore/incident drills and periodic independent security review remain part of owning the product.
