# M0 — Narrow camera and encrypted-handoff feasibility plan

Status: **proposed; not authorized or started**. Ten business days from ready prerequisites, not from this document's date. Returned independent Codex and Claude findings have been reconciled; [review limitations](claude-review.md) remain explicit. Baseline decisions remain proposals.

Owner resource update: see [iPhone-first sequencing/readiness](ios-first-sequence.md). The owner has an iPhone 15 Pro, may borrow an iPhone 17 and currently lacks Android hardware. The broader staffing/device campaign below remains a proposal; it is not the current one-owner calendar commitment.

## Purpose and boundaries

Answer three questions: (1) is main/front public-API still capture good enough without host-library writes; (2) can a minimal recipient-encrypted artifact recover through native transfer/export interruptions without a persistent host photo-decryption key; (3) can the handoff/cleanup/key model be specified and demonstrated without false durability/privacy claims?

M0 would authorize disposable, local native capture/transfer harnesses and synthetic protocol experiments only. No production app architecture, complete onboarding/login provider integrations, username discovery, polished gallery, infrastructure-as-code, production database, App Store submission, public beta, production credentials or user-media cloud collection. The minimum test endpoint/private object store needs explicit owner approval, its own credentials, region and spend monitoring. No public data, permanent media archive or application dependency project is created until that approval.

Do not implement an original cryptographic primitive, quietly disable E2EE, route real users or start M1 because the experiment works. Development after M0 requires another decision.

## Required people, hardware and readiness

Proposed effort cap: **37 specialist person-days** over ten business days: iOS 10, Android 10, backend/reliability 5, QA/imaging 7, product/usability 3 and independent security review 2. Roles may overlap, but the author cannot independently approve their own critical work. This assumes approximately 3.7 FTE of available human capacity plus AI assistance; AI agent count is not a substitute for hardware operators or qualified reviewers. With only two available engineers, keep the original longer timebox or reduce scope explicitly.

Minimum booked hardware, using owned/borrowed devices first:

| Item | Required purpose |
| --- | --- |
| Older supported iPhone, e.g. iPhone 13 | Main/front, lower-tier memory/latency, supported older OS where physically available |
| Modern high-resolution iPhone, e.g. iPhone 16 Pro/17 Pro | Quality/latency without deferred host PhotoKit finalization; actual dimensions |
| Pixel, e.g. Pixel 8 or newer available device | Android baseline image/format/lifecycle path |
| Samsung flagship, e.g. Galaxy S24 class or newer available device | Important camera/OEM path and default-camera comparison |
| Samsung midrange, e.g. Galaxy A55 class | Lower performance/storage, backpressure and practical quality |
| Existing compatible Mac/Xcode plus Android development host | Native signing/build/device access; exact toolchains pinned at kickoff |
| Tripod/phone mount, fixed lighting, lux meter, color/edge/text/corner targets | Reproducible comparisons and geometry/color checks |
| Wi-Fi control plus cellular/network interruption method, local encrypted evidence disk | Known network conditions, real-device recovery and sanitized artifacts |

Exact SKUs, OS builds, free space, device owners/consent, Mac capability and development-signing availability are **not inventoried yet**. An older phone on a current OS is not evidence for the proposed minimum OS; identify missing OS coverage explicitly. Confirm them before the clock starts. These five phones establish feasibility coverage, not support for the entire proposed OS/OEM matrix. Do not buy/rent or upgrade a toolchain from this plan alone. Human test-image subjects must explicitly consent to local capture and evidence retention; use charts/objects where possible and synthetic media for cloud/race tests.

## Execution sequence and stop gates

| Days | Bounded work | Required output / stop |
| --- | --- | --- |
| 1–2 | Two independent minimal native capture harnesses. Pin actual API/library versions; main/front, quality priority, no deferred host-library path, private output. Define admitted capture vs tap and image/framing contract | Reproducible build IDs, camera capability/output inventory, verified private paths. Stop a configuration immediately on any host-library write |
| 3–4 | Metadata/color/orientation, readiness and sustained-shot measurements. Produce one reviewed versioned encrypted artifact/vector profile and a paper key/consent lifecycle | Early camera go/no-go; independent review before consented sensitive media or new crypto assumptions. No library shopping beyond one selected candidate per platform without evidence of a gap |
| 4–7 | Physical-device main/front × daylight/indoor/10-lux capture campaign; matched stock comparisons; bounded memory/backpressure run | Failures and rejected taps counted, original/sanitized/canonical artifacts distinguished; optional mode failures disable that mode |
| 5–8 | Synthetic four-direction transfer/export experiments; crash points; expiry/replay/late PUT; old-snapshot recovery. Start a real 72-hour retention observation no later than day 5 | Demonstrate or explicitly fail the handoff/metadata recovery barrier. No “CloudVerified” based only on a DB response or checksum |
| 8–9 | Blinded quality screening, borrowing-mode/first-use paper task walkthrough, evidence analysis and cost estimate | Record genuine observations separately from facilitator-simulated onboarding. Do not claim a full signup UX was tested |
| 10 | Independent QA/security evidence review and owner-facing result | PASS/FAIL/NOT RUN per configuration/experiment, recommended support/format/protocol decisions, proposed next milestone and revised schedule. Stop; no automatic implementation continuation |

The 72-hour observation runs concurrently, not as an accelerated-clock substitute. Time lost to missing hardware/authentication, OS installs or recruiting shifts the schedule. Do not reduce evidence to meet the date; report incomplete results.

## Measurable experiments and acceptance

1. **Capture and host-library exclusion:** 100 captures per main/front × three lighting conditions × five devices = **3,000 captures** (1,200 iOS, 1,800 Android). Count all attempted/admitted/returned/Prepared events. Zero app-created host system-library assets; zero accepted corruption, black frames or wrong orientation. Use an isolated test library and separately authorized QA auditor to inventory system assets before/after and at observable intermediate points; combine that with instrumented/static auditing of host library-write paths. Broad read permission belongs only to the auditor, not the shipping host flow. Include a host installation that already has library-add permission from prior recipient use. Snapshots alone cannot exclude a transient save/delete; M0 qualifies harness paths, and the integrated app must repeat this gate. Inventory private files and system-library additions around crashes and relaunches. A camera callback without Prepared is not a durability success.
2. **Quality and cadence:** ten matched stock/app chart repeats per camera/lighting/device (300 stock/app comparisons) plus 30 matched natural scenes/device for ten-person blinded screening. Target the existing proposed 04 latency/quality thresholds on each required tested configuration: p95 durable preparation ≤2 s daylight/≤5 s low light, preview targets as specified, investigation at >15% sharpness loss, >3 dB SNR loss or >5 percentage points added chart clipping. Human acceptability ≥90% daylight/indoor and ≥80% low light in the screening sample. Pin chart-analysis tooling; record lux/distance/framing, ROI, resolution normalization, color/decoder and tool versions. Use the ten repeats to calibrate variance; mark quantitative comparisons indeterminate if calibration cannot resolve the threshold. Report all raw counts, confidence limits and systematic defects; small panels do not prove parity. If app-first reviewer preference differs by tier, do not hide it in a global average.
3. **Framing/sanitization:** text and four corner markers in every orientation/main/front; proposed 4:3 framing and unmirrored saved selfies are consistent in recipient app/library. Zero residual GPS/owner/device IDs in inspected supported metadata containers. For metadata-only sanitation, no unapproved pixel/color transform; identify any necessary conversion and measure it independently of the post-sanitation transport hash. On the modern iPhone, where supported, compare ten native JPEG/HEIF pairs per lighting condition locally without PhotoKit finalization. This discovery probe adds no HEIF transfer feature; a material JPEG deficit reopens the format decision. Core campaign counts exclude additional stock/natural-scene/thermal/native-format exposures, which must also be reported.
4. **Thermal/admission:** one 15-minute, 100-shot concurrent synthetic-transfer run/device. Zero dropped admitted captures, crashes or false Prepared records. Report rejected/busy taps, exposure delay, peak memory, backlog and thermal degradation. Queue/CPU pressure must inhibit new admission honestly. Include at least ten rapid five-tap sequences (target 500 ms between attempts), recording actual intervals and every accepted/rejected request; the test does not assume every attempted tap can be captured at quality priority.
5. **Encrypted artifact and native delivery:** at least 25 synthetic photos in each of iOS→iOS, iOS→Android, Android→iOS and Android→Android (100 total), with exact ciphertext/canonical integrity and recipient binding. Twenty crash-point repetitions per OS around Prepared/reservation/receipt; zero accepted wrong-key/tampered/misrouted objects or duplicate app records. Demonstrate retries after reboot without a persistent host-decryptable content-key wrapper. No claim of an audited production cryptographic protocol from passing vectors.
6. **OS recovery/export:** ten repetitions per device for backgrounding, normal process termination, explicit force-quit/force-stop, reboot-before-first-unlock, network switch/interruption and insufficient storage. Ten export-commit interruptions per OS; ambiguous results must become Uncertain, not Saved or automatic duplicate saves. Demonstrate foreground retry; do not require or claim guaranteed stopped-app delivery. Permission-denied, receipt-lost and gallery-full cases remain actionable with their recoverable source intact.
7. **Trust/local-data boundaries:** documented key-pin/reset/new-device table and ten negative transcript/key cases; zero accepted wrong-key approval. Tabletop every borrowing-mode exit (end/expiry/back/relaunch/deep link/notification/error) using synthetic prior-gallery data; none may expose owner data without owner authentication. Verify actual OS key/file accessibility and backup/device-transfer exclusion rules on the devices where available; unexercised restore paths are NOT RUN and block only the corresponding production claim.
8. **Cloud handoff/deletion probe:** at least ten synthetic repetitions per case: lost commit response; host cleanup followed by restoring a pre-commit snapshot; recipient/account/device created after that snapshot; revocation/cancellation replay; lost receipt; near-expiry grant; PUT after deletion; replayed/superseded attempt; upload started before expiry and completed later; worker restart. The experiment must recover or explicitly fail—not silently orphan an acknowledged photo, restore a revoked grant, or treat a recreated terminal object as deliverable. Record exact access cutoff and cleanup detection/removal times. A paper design alone does not pass an executed contract test; if endpoint authorization is withheld, mark this experiment NOT RUN.
9. **Retention and product screening:** real 72-hour synthetic-object observation plus boundary tests. Use eight host/recipient pairs for role/destination/save/expiry comprehension; target ≥90% correct comprehension and zero belief that the app secures the entire borrowed phone or prevents screenshots. Assess both repeat-pairing and first-use installation/auth friction through separately labeled paper/concept walkthroughs; no pairing UI is built or timed as an implemented flow in M0. Harness transfer tests use preconfigured synthetic identities. Do not report facilitator-assisted timings as live pairing or onboarding evidence.

Any required privacy/corruption/wrong-recipient/false-success defect is a fail, not an averageable percentile. Other target failures yield a documented device/mode restriction, revised hypothesis for approval, or no-go. Do not add advanced camera processing to rescue a failing baseline within the same capped experiment.

## Costs and authorization ceiling

All figures below are **USD planning allowances, not current rental/purchase or labor quotes**. Hardware location and owned inventory are unknown. Obtain actual quotes and owner approval before spending. No money or service has been committed in preparing this plan.

| Incremental cash category | Proposed maximum allowance | Basis |
| --- | --- | --- |
| Phone borrowing/rental/logistics | $400 | Existing/borrowed hardware assumed; not a promise that five rentals fit this allowance |
| Charts, mounting/light measurement | $100 | Reuse existing equipment first |
| Isolated cloud/API experiment | $50 | Small synthetic corpus, ≤5 GB planned egress, no managed production DB; cost alerts and manual stop |
| AI review/development usage | $200 | Existing authorized tools; use actual account metering, no automatic plan upgrade |
| Contingency | $250 | Device logistics/retest/service overrun buffer; owner controls reassignment |
| **Proposed incremental ceiling** | **$1,000** | No procurement permission until approved; pause if necessary quotes exceed the ceiling |

Labor assumption: 37 person-days × an illustrative $300–$800/day = **$11,100–$29,600** economic effort; with the full cash allowance, $12,100–$30,600. If salaried staff perform the work, this is opportunity cost, not necessarily a new invoice. Rate, staffing and existing tool subscriptions need owner confirmation. If hardware must be purchased or a compatible Mac is absent, obtain a separate actual quote and reapprove; do not silently fund purchases from this plan.

AWS/model budgets and alerts are not guaranteed hard billing cutoffs. Restrict synthetic corpus and attempts, monitor daily, stop new test work at projected cash exhaustion and report residual in-flight costs. The $50 cloud allowance is not a claim of a provider-enforced spending cap. Provider region pricing remains to be selected; [S3 pricing](https://aws.amazon.com/s3/pricing/) shows the relevant storage/request/egress dimensions.

## Deliverables and exit

- Exact tested device/OS/SDK/library/configuration matrix and reproducible source/build identifiers for the disposable harnesses.
- Capture/readiness/framing/quality/sanitization report, sanitized evidence index and per-configuration decisions.
- Reviewed crypto-envelope/test-vector feasibility and key/borrower/account-lifecycle tables; remaining threat assumptions including no static-key forward-secrecy promise.
- Native transfer/export/fault/72-hour results and a verified cloud acknowledgment/late-write/restore design, or explicit unresolved failures.
- Clearly labeled concept walkthrough observations for repeat pairing and first use; suggested interaction reduction without losing consent. Live pairing/onboarding timing remains a later milestone.
- Actual effort, cash usage, disk/byte/retry costs and next-stage estimate. A passing M0 may inform a shorter schedule; it does not establish one.
- Independent findings/dispositions and a narrowly proposed next milestone for owner approval.

M0 is not the release's full device matrix, 10,000-photo fault campaign, 1,000-session beta sample, comprehensive accessibility certification, production penetration test or operational readiness approval. No experiments described here have been executed in this planning task.
