import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { PhotoGrid } from "@components/PhotoGrid";
import { PhotoTile } from "@components/PhotoTile";
import { PhotoViewer } from "@components/PhotoViewer";
import { defaultSurface, SurfaceScope } from "@shared/surface";
import type { SampleImage, TileStatus } from "@shared/types";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);
const image: SampleImage = { src: "/images/coast.jpg", position: "30% 60%", zoom: 2.5 };
const tile = (status: TileStatus, progress?: number) =>
  html(
    progress === undefined ? (
      <PhotoTile image={image} status={status} label="Photo 3" onOpen={() => {}} />
    ) : (
      <PhotoTile
        image={image}
        status={status}
        progress={progress}
        label="Photo 3"
        onOpen={() => {}}
      />
    ),
  );

describe("PhotoTile", () => {
  test("a saved photo carries no badge", () => {
    expect(tile("saved")).not.toContain("photo-tile__badge");
  });

  test("its name is the label and the state's words", () => {
    expect(tile("needsChecking")).toMatch(/aria-label="Photo 3, Photos save needs checking"/);
    expect(tile("onlyInApp")).toContain('aria-label="Photo 3, Only in this app"');
    expect(tile("arriving", 0.4)).toContain('aria-label="Photo 3, Arriving, 40%"');
  });

  test("every state except saved shows an icon or a ring", () => {
    for (const status of ["arriving", "onlyInApp", "saving", "needsChecking", "expired"] as const) {
      expect(tile(status, 0.5), status).toContain("photo-tile__badge");
    }
    expect(tile("saving", 0.5)).toContain('role="progressbar"');
  });

  test("without onOpen it is an image, not a button", () => {
    const out = html(<PhotoTile image={image} status="saved" label="Photo 3" />);
    expect(out).not.toContain("<button");
    expect(out).toContain('role="img"');
  });
});

describe("PhotoGrid and PhotoViewer", () => {
  test("the grid has a heading per section and a list of tiles", () => {
    const out = html(
      <PhotoGrid
        sections={[
          {
            id: "today",
            title: "Today",
            detail: "2 photos",
            tiles: [
              { image, status: "saved", label: "Photo 1" },
              { image, status: "onlyInApp", label: "Photo 2" },
            ],
          },
        ]}
      />,
    );
    expect(out).toMatch(/<h2[^>]*>Today<\/h2>/);
    expect(out.match(/<li/g)).toHaveLength(2);
  });

  test("the viewer is dark, with a close button and the photo named", () => {
    const out = html(
      <SurfaceScope surface={defaultSurface}>
        <PhotoViewer
          image={image}
          title="Today, 2:14 PM"
          status={null}
          footer={null}
          onClose={() => {}}
        />
      </SurfaceScope>,
    );
    expect(out).toContain('data-theme="dark"');
    expect(out).toContain('aria-label="Close"');
    expect(out).toContain('aria-label="Photo, Today, 2:14 PM"');
  });
});
