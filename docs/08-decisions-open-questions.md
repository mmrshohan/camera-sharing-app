# 08 — Decisions & Open Questions

Status: decision log for review. Date: 27 October 2026. Only the user brief is confirmed; all engineering choices below are recommendations unless explicitly marked confirmed. No implementation approval is implied.

## Confirmed requirements

| ID | Requirement | Origin |
| --- | --- | --- |
| C01 | Public-release iOS and Android consumer apps | User brief |
| C02 | Recipient physically uses host phone; host approves connection | User brief/example |
| C03 | QR or username pairing; delivery to recipient app and system library | User brief |
| C04 | App does not put recipient's photographs in host system library | User brief |
| C05 | Minimal camera, gallery and profile/settings; privacy and photo quality are primary | User brief |
| C06 | Reliable, recoverable transfer; upload success is not delivery | User brief |
| C07 | Planning documents only; no code, dependencies, scaffold, mockups or infra until explicit authorization | User brief |

## Proposed decisions and alternatives

| ID | Recommendation | Reason / trade-off | Approval gate |
| --- | --- | --- | --- |
| D01 | Separate Swift/SwiftUI and Kotlin/Compose apps | Native camera/lifecycle control and polish outweigh shared-UI development savings | Before M0 |
| D02 | Host library exclusion takes priority over deferred processing/stock-camera parity | iOS deferred proxy finalization conflicts with C04; quality and capture speed must be measured | Before M0; reassess with evidence |
| D03 | Modular Node/TypeScript API + worker, Postgres, private S3 | Simple operations and transactional consent/delivery; managed infrastructure costs more than a bare VM | Before production foundation |
| D04 | Device-bound end-to-end photo encryption; no server key escrow | Limits server exposure; device/key loss can make undelivered/app-only photos unrecoverable | Before crypto implementation |
| D05 | QR key binding; mandatory first-session code comparison for username pairing | Stronger assurance than a server-controlled directory alone; introduces friction | Before pairing UX/protocol |
| D06 | Cloud 72h absolute TTL; delete early on durable recipient-app receipt | Bounded exposure/cost; prolonged receiving failure causes expiry; system export may still be pending | Before transfer implementation |
| D07 | End session preserves already server-reserved transfers; cancellation is separate | Avoid accidental photo loss and unclear consent | Before session implementation |
| D08 | Host sees live preview/last shot only during active session; no export/persistent gallery | Useful capture review without pretending the host cannot copy what it sees | Before camera UX implementation |
| D09 | Initial JPEG interoperability; HEIF/HDR only after M0 proof | Reliable decoding/metadata path over optional format sophistication | M0 exit |
| D10 | iOS 18+, Android 10+ proposed minimums; current store target/SDK separately | Balances modern APIs with device reach; market/device evidence can change minimums | M0 exit |
| D11 | Apple + Google account access across platforms; no auto-link by email | Cross-platform continuity, no password recovery surface; additional sign-in integration effort | Before identity implementation |
| D12 | App copy and Photos export tracked separately; explicit uncertain-export handling | Avoid false success and unbounded duplicates; absolute exactly-once OS saves not guaranteed | Before gallery implementation |
| D13 | No location permission; sanitized allowlist metadata | Reduces sensitive metadata; sanitation must preserve fidelity | M0 exit |
| D14 | One host + one recipient device/session, two-hour lease, 15-minute idle end | Clear destination and bounded offline authority; renewal/recovery adds some friction | Before pairing implementation |
| D15 | No automatic historical-media recovery on new device | Consistent with no escrow; requires candid loss warning | Before account/device implementation |

## Assumptions requiring validation

| ID | Assumption | How to validate | Consequence if false |
| --- | --- | --- | --- |
| A01 | Public native camera output without host-library writes meets quality threshold | Matched physical-device M0 comparisons | Narrow devices/modes or revisit product; never silently write host library |
| A02 | Simple JPEG pipeline satisfies target users | Quality panel and cross-platform decode/metadata tests | Reassess canonical HEIF/Ultra HDR strategy and maintenance cost |
| A03 | OS transfer scheduling plus foreground recovery is acceptable | Locked/force-stopped device experiments and paired-user studies | Revise promise/copy or session behavior; no guaranteed instant background delivery |
| A04 | Maintained interoperable envelope libraries fit both minimum OS versions | SDK/library audit, test vectors and security review | Select reviewed alternative primitive/suite or raise minimum OS |
| A05 | Receipt-triggered cleanup is acceptable with delayed library saving | Comprehension tests and permission-denial flow | Retain until export only with new retention/cost decision |
| A06 | Account/provider flows work across iOS/Android with stable identity linking | Apple web/service-ID + Google native flow feasibility and review | Add supported login/account linking scope before launch |
| A07 | Proposed team can deliver in 24–32 weeks | Staffing confirmation and M0 estimate | Rebaseline schedule, scope and funding |
| A08 | 5 MB average, 30 photos/DAU/day is useful budget basis | Beta size/activity distribution and retries | Revise caps, provider choice and budget |
| A09 | Exact-username requests and code comparison are usable | ≥8–12 paired usability sessions | Adjust flow without losing consent/key assurance |

## Unresolved product and business questions with recommended defaults

These questions are recorded for approval rather than blocking completion of planning.

| ID | Decision needed | Recommended default | Why it matters / deadline |
| --- | --- | --- | --- |
| Q01 | Launch countries and intended age audience | One explicitly chosen initial market; adults first, no child-directed positioning | Residency, disclosures, safety/support and testing; choose before production infrastructure |
| Q02 | Initial budget, staffing and acceptable monthly spend | Fund three-week M0 first; approve recurring cap after measured media costs and region pricing | Determines feasible scope/schedule; approve before M0/provisioning respectively |
| Q03 | Retention versus long offline delivery | Fixed 72h, visible expiry and early receipt cleanup | Irrecoverable expiry versus privacy/cost; approve before transfer work |
| Q04 | Recovery after phone loss | No escrow or old-media restore in MVP; saved OS copies remain user-controlled | Major key architecture and expectation impact; approve before crypto work |
| Q05 | What happens to offline unreserved captures when lease ends? | Preserve encrypted within local TTL; require fresh bilateral approval to the same recipient before transfer | More friction, but no silent post-consent routing; approve before session/queue work |
| Q06 | Temporary host review | Last capture while active; clear at background/end; no persistent review | Privacy versus confidence; screenshots remain possible; approve before camera UX |
| Q07 | Sign-in and account continuity scope | Apple and Google access on both platforms with deliberate linking | Avoid a platform-only login trapping a switching user; confirm during M0/M1 |
| Q08 | Cellular transfers and localization | Clearly disclosed cellular auto-transfer; choose launch languages after market confirmation | Data cost and usability; before beta |
| Q09 | App name, legal entity and support ownership | Use Camera Sharing App as working title; assign named operator before external beta | Store enrollment, policy/contact and incident responsibility |
| Q10 | Regional storage and final compliance obligations | Single region selected from launch-country needs; legal review before public beta | Do not infer residency or legal requirements from developer timezone |

## Risks that can block release

| Risk | Severity | Owner role | Mitigation / exit evidence |
| --- | --- | --- | --- |
| Unacceptable native-camera quality under privacy constraint | Critical | Mobile leads + product | M0 measured go/no-go; tested support matrix |
| Wrong recipient/key or authorization bypass | Critical | Backend/security leads | Protocol review, negative authorization tests, penetration testing |
| Silent loss/false save or unrecoverable queue corruption | Critical | Mobile/backend leads | Lifecycle fault injection, explicit uncertainty states and soak |
| Device-key loss mistaken for recoverable cloud backup | High | Security/product | Clear onboarding, deletion/logout warnings, no recovery promise |
| Background delivery expectation exceeds OS behavior | High | Mobile/product | Physical-device tests, honest status/copy, foreground recovery |
| Offline revocation or screenshots misrepresented | High | Security/design | Lease model, boundary language and comprehension testing |
| E2EE abuse handling fails store expectations | High | Product/trust/legal | Consent, block/report, reviewed policy and support workflow |
| Expiry cleanup/backups resurrect access | High | Backend/operations | Durable tombstones, isolated restore rehearsal, expiry alerts |
| Egress/abuse costs exceed funding | High | Backend/business | Budget model, quotas, beta cost metrics and spend alerts |
| Unsupported SDK/OS or policy submission requirements | High | Mobile/release | Recheck official requirements before submission; no fixed future SDK assumption |
| Small team cannot sustain two platforms and on-call | High | Founder | Confirm staffing and maintenance budget before launch commitment |

## Executive recommendation and approval package

Build a camera-first borrowing experience with one explicit recipient, native mobile camera stacks and an encrypted temporary relay. Keep ordinary use to Camera, Gallery and Profile/Settings. Preserve native encoded photo quality through transfer; measure how closely each tested device approaches its stock camera rather than claiming parity.

Approve the native-app direction and the three-week M0 feasibility milestone first. Before broader development, explicitly approve the privacy/quality trade-off, no-escrow encryption, 72-hour expiry and cleanup boundary, host review policy, offline capture/lease semantics, target devices, launch market and budget. The recommended technology stack is in [02](02-technical-architecture.md); measurable go/no-go evidence is in [04](04-camera-engineering.md); the full sequence is in [07](07-delivery-roadmap.md).

Sequence: camera feasibility → identity/device keys → verified pairing → encrypted capture/transfer/receipt → gallery/export/recovery → security/accessibility hardening → cross-platform QA/beta → store review and monitored launch. This is a recommended plan, not authorization to execute it.

## Decision history

27 October 2026 — User brief recorded as C01–C07. Eight planning specifications drafted from official platform documentation and architectural analysis. No hardware validation, production security audit, pricing quote, legal clearance or implementation has occurred. Approval status of D01–D15 remains proposed.
