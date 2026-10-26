# 01 — Product Requirements Document

Status: planning proposal; implementation is not authorized. Date: 27 October 2026.

## Product and recommendation

Camera Sharing App lets a recipient borrow another person's camera hardware, physically take photographs on that phone, and receive the photographs on their own phone. The host explicitly approves the session. The app never intentionally writes borrowed-session photographs to the host's system photo library.

Build separate native iOS and Android apps with a temporary encrypted cloud relay. Optimize the main camera first; validate quality before committing to launch scope. Promise recoverable delivery within a disclosed retention window, not instant delivery under every operating-system condition. No remote viewfinder or remote shutter is implied by “camera sharing.”

## People and jobs

| Persona | Job | Main concern |
| --- | --- | --- |
| Recipient, Sarah | Use Alex's better camera and keep the photographs | Correct destination, quality, knowing photos are safe |
| Host, Alex | Lend a phone without accumulating someone else's photographs | Explicit consent, limited access, session ending |
| Intermittently connected traveler | Finish receiving after changing networks | Recovery, storage and expiry warnings |
| Accessibility user | Pair, capture and recover without visual precision | Screen reader support, large controls, clear status |

The photographer is whoever physically holds the host device. The recipient is the account and designated device approved for delivery. These are roles within a session, not permanent account types.

## MVP boundary

Include still photography; one host device and one recipient device per session; QR pairing and exact-username lookup; bilateral consent; rear main camera and front camera; capability-gated lens switching, tap focus, exposure compensation, zoom and flash; encrypted temporary transfer; recipient app gallery; automatic system-library saving when permitted; explicit retry and storage recovery; session end, device revocation, blocking, reporting and account deletion.

Exclude video, Live Photos, RAW/ProRAW, burst mode, editing, filters, remote camera controls, live streaming, groups, multiple recipients, shared albums, public feeds, contact-book import, nearby Bluetooth discovery, peer-to-peer transport, permanent cloud backup, monetization and general photo-library browsing. Portrait and dedicated Night modes require feasibility approval before inclusion. “HDR” is not a universal user-facing promise.

## Primary journeys

1. **First use:** explain borrowing and its privacy boundary; authenticate only when pairing or receiving; register device keys; select a unique username. Ask for camera permission on capture entry. Ask for recipient photo-library add permission in context. Notifications remain optional.
2. **QR:** Sarah opens Receive and displays a short-lived invitation. Alex scans it using the app. Both see roles, username and matching verification code. Sarah verifies the host and Alex approves lending. The session becomes active only after both approvals and key binding. Sarah takes Alex's phone.
3. **Username:** Alex enters Sarah's exact username and sends a request. Sarah accepts on her intended device. The same identity/key confirmation and bilateral consent apply; a matching name alone proves no identity.
4. **Capture:** the host screen always says “Sending to @sarah.” A shutter response acknowledges capture; a separate state confirms durable local preparation. No host library write occurs. Transfers queue without blocking further capture until storage or queue limits are reached.
5. **Receive:** Sarah sees thumbnails only after local decryption and integrity checks. “Received” means an encrypted app copy is durable. “Saved to Photos” means the OS save operation completed. Permission denial leaves the received photo available in the app.
6. **End:** either person stops new captures. Previously server-reserved photographs keep transferring within the stated retention period, as defined in 06. The host's review access ends immediately in the compliant app. Ending a session and canceling undelivered photos are separate actions.
7. **Failure:** status explains the actual blocker, next action and time remaining. Relaunch reconciles pending work. Expired or deliberately canceled photos are never labeled delivered.

## Functional requirements and acceptance

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-01 | Bilateral, device-bound pairing | Expired/replayed QR, wrong device and one-sided consent cannot activate a session |
| FR-02 | Destination cannot silently change | Recipient/device/key changes require a new session and confirmation |
| FR-03 | Host library exclusion | Zero host Photos/MediaStore assets across 1,000 borrowed-session captures per platform, including failure paths |
| FR-04 | Durable capture queue | Each “Prepared” photo has a stable ID, encrypted file and recoverable local journal; every accepted capture reaches a terminal or actionable state |
| FR-05 | Verified delivery | Upload completion alone cannot produce Received or Saved to Photos |
| FR-06 | Idempotent transfer | Repeated callbacks, requests and acknowledgments create one app-gallery record per photo ID |
| FR-07 | Permission independence | Recipient can receive with library permission denied; host requires no library permission |
| FR-08 | Consent and revocation | Revoked devices cannot obtain new grants; offline and already downloaded limitations are disclosed |
| FR-09 | Recovery and expiry | Airplane mode, relaunch, reboot and low-storage cases reconcile without a false success; expiry is visible |
| FR-10 | Deletion and abuse | In-app account deletion, external deletion request page, exact lookup rate limits, block/report and support path exist |

## Nonfunctional requirements

These are proposed release gates, not measured results. Measure separately by device tier, OS and network.

- API availability: 99.9% monthly excluding neither internal faults nor routine deploys; report provider outages separately. Recovery point objective ≤15 minutes for control-plane records, recovery time ≤4 hours; media durability is governed separately by local/cloud copies.
- Foreground delivery: ≥99.5% of prepared test photos received within five minutes when both apps are runnable, storage is sufficient, service is healthy, and each link supplies ≥10 Mbps with ≤100 ms RTT. For a ≤10 MB photo, p95 capture-prepared-to-received ≤30 seconds under those conditions. Track all attempted captures and exclusions separately to avoid hiding failures.
- Reconciliation: start within five seconds of authenticated foreground entry; recover eligible pending work within five minutes under the same network conditions. No finite background-delivery SLA.
- Crash-free sessions ≥99.8% in beta, based on at least 1,000 sessions; no unresolved photo-loss or unauthorized-access defects.
- No server-readable photo plaintext under the proposed encryption design; no photos, keys, presigned URLs or usernames in routine analytics.
- Camera and accessibility gates are in [04](04-camera-engineering.md) and [05](05-ui-ux-design.md).
- Initial planning envelope: 1,000 daily active users, 30 photos/user/day, average 5 MB, approximately 150 GB uploaded/day. Load test control plane at ten times modeled peak before launch; revise from beta traffic.

## Policy defaults requiring approval

Online activation, followed by bounded offline capture within the session lease. A session lasts at most two hours and ends after 15 minutes of capture inactivity; renew online with both users' awareness. Capture remains bound to the original recipient. Limit to 100 pending photos or 1 GB per host, whichever occurs first. Warn at 80%; never silently discard to make space.

Cloud ciphertext expires 72 hours after reservation/first upload authorization, irrespective of retries. Delete earlier after durable recipient-app receipt. Host ciphertext expires no later than 72 hours after capture and is removed earlier after verified cloud staging. Recipient app copies remain until the recipient deletes them or uninstalls. System-library copies follow the user's OS/cloud-library settings. These limits favor privacy and bounded cost over indefinite recovery; see [06](06-photo-lifecycle-reliability.md).

The recipient owns app-level disposition rights; this is not a claim about legal copyright. Host review defaults to live preview and the most recent capture only while the session is active; no export or persistent host gallery. Review is best effort on a trusted, compliant device and cannot prevent screenshots or malicious extraction.

## Validation and discovery

Before beta, run moderated tests with 8–12 host/recipient pairs, including accessibility users. Target ≥90% unassisted pairing within 60 seconds after account setup, ≥90% correctly identifying the destination and the difference between Received and Saved, and zero participants believing screenshots are prevented. Revise copy and flow if these fail. Awards are an aspiration; observable usability and reliability determine readiness.
