# iPhone-first feasibility sequence and readiness

Status: proposed staged sequence following the owner's go-ahead to advance toward M0. The owner asked whether iPhone should precede Android; this is the recommended bounded approach. No application code or test results are introduced by this page. Paid spending, the original 37-person-day staffing assumption and production development are not approved by implication.

## Known resources and authorization limits

The owner reports an **iPhone 15 Pro** on the “latest iOS” and can later borrow an **iPhone 17**. The exact iOS version/build and second device's availability are not yet verified. The owner will perform physical testing; no additional human test team has been confirmed. No Android device is currently available.

Read-only Mac inspection found macOS 27.0, the active developer directory `/Library/Developer/CommandLineTools`, an `xcodebuild` error requiring Xcode, and no `devicectl` in the active tools. No full Xcode app was found under `/Applications` or the user's Applications directory. This does not rule out a nonstandard installation. No software was installed, license accepted, developer directory changed, signing identity created or phone data inspected.

Full Xcode and its compatible iOS tooling are a prerequisite to building/device testing. Use [Apple's Xcode distribution](https://developer.apple.com/xcode/); if already installed elsewhere, verify its path instead of reinstalling. Record actual toolchain, iOS build, device trust and signing readiness before making a build/run claim. Installation/account prompts remain owner-controlled.

## Recommended sequence

| Stage | Hardware | Bounded objective and exit evidence |
| --- | --- | --- |
| Readiness | Existing Mac + iPhone 15 Pro | Verify full Xcode, exact phone OS, signing/device trust and safe test-image handling. No hardware purchase or paid cloud service needed for readiness |
| M0-A — iPhone camera feasibility | iPhone 15 Pro | Disposable native main/front capture experiment on synthetic charts/objects; final image quality, readiness/cadence, orientation/color/metadata and no app-created host-library assets. Keep camera outputs private; no cloud/photos-of-people trial. Preserve the distinction between an admitted shutter request and a durable photo |
| M0-B — iPhone delivery/recovery feasibility | iPhone 15 Pro + borrowed iPhone 17 | After the relevant protocol/key/acknowledgment design gates are resolved, exercise encrypted delivery, durable receipt versus system-library save, interruption/retry and no duplicate/false success. A simulator may assist development but cannot qualify physical two-device background behavior |
| M0-C — Android feasibility | Borrowed/test Android hardware when available | Test public-API camera quality, format/crypto interoperability and native lifecycle on a representative Android phone before freezing shared contracts or committing to the final Android scope. Expand the existing device matrix before release |

One phone is enough to investigate its capture pipeline; it is not evidence of phone-to-phone delivery, other iPhone models, older OS support or Android compatibility. Each stage reports only configurations and scenarios actually tested. Android is sequenced later, not removed from the product or waived from release gates.

Use the measurable methods and failure rules from [the full M0 proposal](m0-feasibility-plan.md). Before code-bearing M0-A work, record the selected experiment scope and actual ready hardware/toolchain; before later stages, obtain the additional resources and applicable authorization. Do not claim the entire five-phone campaign passed from the one-device experiment. Test-data persistence/encryption policy must be explicit; do not label a private plaintext test file as a production encrypted Prepared artifact.

## What stays shared

Keep photo IDs, envelope/schema versions, recipient/consent binding, state transitions and error meanings independent of platform. Keep native camera and background adapters platform-specific. Choose a cryptographic profile only after iOS/Android library feasibility is established; do not hardwire an Apple-only assumption into the backend. B1–B4 in [the decision memo](decision-memo.md) remain gates before their affected implementation.

## Effort and spending

The prior ten-business-day/37-person-day/five-phone M0 is a wider cross-platform proposal, not the current staffing commitment. It must not be presented as a guaranteed calendar estimate for one owner plus AI agents. Establish a smaller M0-A estimate after Xcode/device readiness; account separately for AI-assisted engineering and the owner's physical test time.

Start with owned/borrowed hardware and existing tools. No new hardware, paid services, subscriptions or staffing purchase is committed. Local camera feasibility does not require provisioning the production backend. A passing M0-A leads to an explicit M0-B decision, not an automatic full-app or release authorization.
