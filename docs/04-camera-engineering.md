# 04 — Camera Engineering Specification

Status: feasibility-led proposal; no device results exist. Date: 27 October 2026.

## Camera quality contract

Deliver the best stable processed still capture available through public APIs without writing to the host's system library. Never imply exact Apple Camera, Pixel Camera or Samsung Camera parity. Public API support is not evidence of identical processing, speed or output. A capability can exist but still fail the product's quality gate on a specific lens, format or firmware.

Evidence labels below: **D** = documented API capability; **T** = must be verified on hardware; **P** = proposed product policy. Enumerate capabilities at runtime, then apply a tested device/configuration policy. Do not infer lens or feature availability from a model name alone.

## Native capability assessment

| Capability | iOS | Android | MVP policy / validation |
| --- | --- | --- | --- |
| Main/front cameras | AVFoundation capture devices and photo output (D) | CameraX Preview + ImageCapture (D) | Required; verify orientation, mirroring and interruptions (T) |
| Ultrawide/telephoto | Device discovery and virtual-device zoom, where exposed (D) | Logical/physical camera exposure depends on device; CameraX selectors first, Camera2 investigation for gaps (D/T) | Offer only tested accessible lenses; no promise of stock-app lens coverage (P) |
| Autofocus | Supported device focus modes/points (D) | CameraX focus/metering (D) | Tap focus; unsupported/fixed-focus lens degrades gracefully (P/T) |
| Exposure | Device exposure modes/compensation and supported ranges (D) | CameraX exposure compensation; Camera2 for advanced control (D) | Auto plus modest compensation; manual ISO/shutter excluded (P) |
| Zoom | Device zoom range and switch-over behavior (D/T) | CameraX zoom ratio/linear zoom within supported range (D) | Pinch + useful tested focal presets; digital zoom labeled honestly (P) |
| Flash | Supported flash modes and scene behavior (D/T) | CameraX flash modes; extension constraints vary (D/T) | Auto/off/on only where available; no capture while torch state conflicts (P) |
| Resolution | Select supported dimensions for active format/output/settings (D) | ResolutionSelector/use-case negotiation and actual output dimensions (D) | Stable processed still target ≥12 MP where configuration supports it; exception needs explicit matrix entry (P/T) |
| HDR processing | Public processed photo pipeline varies with format/device; HDR video support says nothing about still output (D/T) | OEM HDR extension and Ultra HDR output are distinct capabilities (D/T) | Do not advertise universal HDR or gain-map preservation before end-to-end tests (P) |
| Portrait effects | Depth/mattes on supported configurations supply inputs, not automatic stock Portrait equivalence (D) | OEM Bokeh extension may be available (D/T) | Dedicated Portrait deferred pending measured benefit (P) |
| Low light | Quality-prioritized processing, device-dependent; no assumed public stock Night-mode switch (D/T) | OEM Night extension where available (D/T) | Baseline required; optional Night only after latency and quality validation (P) |
| Processing | Use platform processed photo data rather than video-frame grabs (P) | ImageCapture file/output path, not preview screenshots (P) | No beauty/AI filter, no server image processing (P) |
| Metadata | Capture output can include EXIF, depth and calibration (D) | Capture output includes format/device-dependent metadata (D/T) | Sanitize before encryption; preserve orientation/color profile, remove GPS/device serials/owner identifiers (P) |

## iOS pipeline and privacy conflict

Use a serialized AVCaptureSession lifecycle, preview layer hosted through a narrow SwiftUI bridge, and AVCapturePhotoOutput for final still data. Configure supported photo dimensions and quality prioritization; begin with quality priority, then measure responsiveness. Apple documents the quality/speed trade-off, rather than a universal latency. [Photo quality prioritization](https://developer.apple.com/documentation/avfoundation/avcapturephotosettings/photoqualityprioritization).

Apple's deferred photo workflow sends a photo proxy to PhotoKit for finalization. That creates a host-library asset, conflicting with the central product requirement. Disable automatic deferred delivery in borrowed sessions and accept a possible quality/shot-speed trade-off. Do not “save then delete”: the asset could be visible, synced or recoverable. [Apple deferred photo workflow](https://developer.apple.com/videos/play/wwdc2023/10105/).

Apple's 2026 high-resolution guidance discusses selecting supported dimensions and the associated processing/responsiveness trade-offs. M0 must inspect the actual SDK availability, supported formats and final-file results rather than assume 24/48 MP behavior across devices. Full sensor megapixels alone do not establish better quality. [High-resolution photo capture](https://developer.apple.com/videos/play/wwdc2026/304/).

Depth maps and portrait mattes are supported only on particular capture configurations and require processing decisions; they do not provide a turnkey reproduction of Apple's Portrait look. [Depth capture](https://developer.apple.com/documentation/avfoundation/capturing-photos-with-depth), [portrait matte availability](https://developer.apple.com/documentation/avfoundation/avcapturephotosettings/isportraiteffectsmattedeliveryenabled).

Use final compressed photo representation; do not round-trip through a generic bitmap encoder unless required for metadata sanitation and proven to preserve image fidelity. If HEIF-to-JPEG conversion is required for receiver compatibility, disclose the quality/file-size trade-off and treat the converted bytes as the canonical deliverable before hashing/encryption. Do not transmit a deferred proxy as if it were a finished photograph.

## Android pipeline and fragmentation

Use CameraX lifecycle binding and ImageCapture with capture quality priority. Negotiate resolution with the bound Preview + ImageCapture combination and inspect the actual output. Save privately on the host; never invoke the external stock-camera intent, which can write into shared media. Camera2 is an escape hatch for a documented, tested gap, not a second default engine. [Image capture](https://developer.android.com/media/camera/camerax/take-photo), [configuration and resolution negotiation](https://developer.android.com/media/camera/camerax/configuration).

CameraX Extensions exposes OEM-implemented HDR, Night, Auto, Bokeh and retouch modes only when available. Availability varies per camera and device; rebinding can affect controls and latency. Never assume Samsung's private processing stack is accessible because a Samsung extension exists. Disable retouch by default and exclude it from MVP. [Extensions](https://developer.android.com/media/camera/camerax/extensions-api).

Ultra HDR JPEG/R is a file/display path distinct from multi-frame HDR scene processing. CameraX documents an Ultra HDR output option on supported configurations. Enable only after verifying the pinned stable release, runtime capability, gallery decoding, cross-platform transfer and gain-map preservation. Baseline interoperable JPEG remains the safe MVP fallback. [CameraX release notes](https://developer.android.com/jetpack/androidx/releases/camera).

## Formats and metadata policy

Proposed baseline: JPEG, sRGB, normalized orientation handling and no location permission. Evaluate HEIF on iOS as a capability-negotiated improvement in M0; avoid forcing a lossy cross-platform transcode without evidence. Preserve the canonical encoded image through encryption/decryption without recompression. Use capture time for display, server reservation time for expiry, and a stable sequence for ordering; a wrong device clock must not reorder or extend retention.

Strip GPS, maker-note identifiers and unneeded auxiliary/depth data before encryption using a tested allowlist; preserve ICC/color interpretation and orientation. Test the sanitizer on actual files and ensure it does not silently remove an HDR gain map or re-encode pixels. If it cannot preserve an optional format safely, disable that format. Host thumbnails are memory-only; recipient thumbnails are encrypted app storage.

## Physical-device test matrix

Select exact owned/rented SKUs and OS builds at M0 kickoff; these are representative categories, not a claim of tested compatibility. Latest stable OS at execution and previous supported versions must be included; beta OS is exploratory only.

| Tier | Representative devices | Coverage |
| --- | --- | --- |
| Older supported iOS | iPhone 12/13 class | Memory pressure, main/front, baseline quality, iOS 18 where available |
| Modern standard iOS | iPhone 15/16 class | High-resolution sensor, HEIF, thermal/transfer behavior |
| Modern Pro iOS | Current available Pro and one prior Pro | Ultrawide/telephoto, switching, 48 MP feasibility, low light |
| Google Android | Pixel 7/8 class and current available Pixel | CameraX baseline, HDR/extension differences, current Android |
| Samsung flagship | Galaxy S23/S24 class and current available flagship | OEM extensions, auxiliary cameras, background restrictions |
| Samsung midrange | Galaxy A-series class | Slow storage/CPU, memory, thermal and supported extensions |
| Additional Android OEM | Xiaomi/Redmi or Oppo class relevant to launch market | Aggressive power management, camera exposure, network recovery |
| Boundary devices | Lowest-memory supported phone; one device without Night/HDR extensions | Honest feature fallback and queue behavior |

Every release: all core tiers with main/front, portrait/landscape rotation, flash, near/far focus, daylight, backlit faces, mixed light, 10-lux low light and moving subjects. Compare each phone to its own stock camera under matched lens/framing and comparable auto settings; use a tripod, measured light, color/edge chart and repeated human subjects with consent. Preserve sanitized test artifacts, SDK/OS versions, actual resolution, mode, lens, temperature and timings.

For delivery, test iOS→iOS, iOS→Android, Android→iOS and Android→Android; include different OEM receivers, notification denial, Photos denial, locked-before-first-unlock and low storage. Emulators cannot qualify image quality or background behavior.

## Measurable gates and feasibility decision

Proposed targets; M0 may revise them with evidence and explicit approval, never silently lower them.

- 100 valid captures per required lens/lighting configuration per device tier, with zero corrupt, black, wrong-orientation or misrouted files. Zero host-library additions across the larger 1,000-photo platform privacy run.
- Shutter visual/haptic acknowledgment p95 ≤100 ms; distinguish acknowledgment from exposure timing. Preview ready p95 ≤1.5 seconds warm and ≤2.5 seconds cold, after permissions granted, excluding an OS interruption.
- Main-camera daylight shutter-to-durable-Prepared p95 ≤2 seconds; low-light baseline p95 ≤5 seconds. Optional long exposure/Night may exceed this only with explicit progress and a measured timeout policy.
- Preview target ≥30 fps for 95% of a five-minute ordinary session; no UI hangs >250 ms. Test a 15-minute/100-shot session with concurrent uploads; no crash, no dropped accepted capture, and responsive thermal backpressure.
- Measure chart sharpness (MTF50), noise/SNR, clipping and white-balance deviation against each device's stock camera over at least ten matched repeats. Proposed investigation threshold: >15% median sharpness loss, >3 dB SNR loss, or >5 percentage points additional clipped chart patches. These are escalation thresholds, not claims that one metric defines photographic quality.
- Blind A/B panel of at least ten people over 30 matched scenes per core tier: app output judged acceptable in ≥90% of daylight/indoor scenes and ≥80% of low-light scenes. Report confidence limits, device differences and stock preference rather than claim parity from small samples.
- Canonical encoded bytes before encryption equal recipient-decrypted bytes by SHA-256 in 100% of integrity tests. Library exports decode correctly and retain intended dimensions, orientation and color appearance; OS transformations are assessed separately.
- GPS/identifier allowlist checks pass for every supported format. Capability-specific UI never exposes a control that fails solely because the device lacks that capability.

**Go/no-go:** if main/front camera quality or host-library exclusion fails on a required tier, stop feature development and present measured options: narrow supported devices/modes, revise quality expectations, or reject the product approach. Do not relax the privacy promise to hide a camera limitation.
