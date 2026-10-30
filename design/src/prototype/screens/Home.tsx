import { devices } from "@components/DeviceFrame";
import { EmptyState } from "@components/EmptyState";
import { InlineMessage } from "@components/InlineMessage";
import { Numeral } from "@components/Numeral";
import { PhotoGrid } from "@components/PhotoGrid";
import { RingButton } from "@components/RingButton";
import { TopBar } from "@components/TopBar";
import { strings as s } from "@prototype/copy/home";
import { people, samples } from "@prototype/model/fixtures";
import { recipientTiles } from "@prototype/model/selectors";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { AccountButton, RingBar, ScreenBody } from "./parts";

export const screenId = "screens/Home";

const fallbackSample = { src: "/images/coast.jpg", position: "50% 50%", zoom: 2.5 };

export function Home({ id }: { id: DeviceId }) {
  const { device, world, dispatch } = useDeviceView(id);
  const session = world.session;
  const pending = session?.state === "requested" || session?.state === "verifying";
  // Sarah's Home goes live while photos can arrive.
  const live = id === "sarah" && session?.state === "active" ? session : null;
  const current = live ? device.gallery.filter((p) => p.sessionId === live.id) : [];
  const arriving = current.filter((p) => p.stage === "arriving").length;
  const received = current.filter(
    (p) => p.stage !== "arriving" && p.stage !== "canceled" && p.stage !== "expired",
  ).length;
  const sections = id === "sarah" ? recipientTiles(world) : [];
  const ios = devices[device.model].platform === "ios";
  const hostOffline = live !== null && world.devices.alex.network === "offline";
  const busy = live !== null || pending;

  const lend = () => {
    dispatch({ type: "navigate", device: id, route: "scanner" });
    // Asked at the moment of need: the scanner needs the camera (R8).
    dispatch({ type: "requestPermission", device: id, kind: "camera" });
  };

  return (
    <ScreenBody
      floating
      top={(scrolled) => (
        <TopBar
          title={s.title}
          collapsed={scrolled}
          trailing={
            <AccountButton
              name={people[id].name}
              label={s.settings}
              onPress={() => dispatch({ type: "navigate", device: id, route: "settings" })}
            />
          }
        />
      )}
      bar={
        <RingBar>
          <RingButton
            variant="tinted"
            icon="borrow"
            label={s.borrow}
            // A live session makes both rings unavailable; the reason is said once, under Lend.
            state={live ? "unavailable" : pending ? "waiting" : "rest"}
            onPress={() => dispatch({ type: "openPanel", device: id, panel: "invitation" })}
          />
          <RingButton
            variant="filled"
            icon="lend"
            label={s.lend}
            state={busy ? "unavailable" : "rest"}
            unavailableReason={s.sessionRunning}
            onPress={lend}
          />
        </RingBar>
      }
    >
      {live && (
        <Numeral
          value={received}
          caption={s.liveCaption}
          detail={arriving > 0 ? s.onTheWay(arriving) : s.liveFrom(live.host.name)}
          live
        />
      )}
      {hostOffline && live && (
        <InlineMessage
          tone="waiting"
          icon="offline"
          title={s.waitingTitle(live.host.name)}
          body={s.waitingBody}
        />
      )}
      {device.storageFull && (
        <InlineMessage
          tone="problem"
          icon="storage"
          title={s.storageTitle}
          body={s.storageBody}
          action={{
            label: s.storageAction,
            onPress: () => dispatch({ type: "navigate", device: id, route: "settings/storage" }),
          }}
        />
      )}
      {ios && device.permissions.photosAddOnly === "denied" && (
        <InlineMessage
          tone="neutral"
          icon="save"
          title={s.accessTitle}
          body={s.accessBody(device.settings.autoSave)}
          // Settings is outside the app; here it stands in for turning access back on there.
          action={{
            label: s.accessAction,
            onPress: () =>
              dispatch({ type: "permission", device: id, kind: "photosAddOnly", allow: true }),
          }}
        />
      )}
      {sections.length > 0 ? (
        <PhotoGrid
          sections={sections.map((section) => ({
            id: section.sectionId,
            title: section.title,
            detail: section.detail,
            tiles: section.tiles.map((tile) => ({
              image: samples[tile.sample] ?? fallbackSample,
              status: tile.status,
              progress: tile.progress,
              develop: tile.develop,
              label: tile.label,
              onOpen: () => dispatch({ type: "openPhoto", device: id, id: tile.id }),
            })),
          }))}
        />
      ) : (
        !live && <EmptyState icon="photos" title={s.empty} body={s.emptyBody} />
      )}
    </ScreenBody>
  );
}
