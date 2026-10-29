import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "top-bar",
  name: "TopBar",
  group: 3,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "The screen's title and its few controls: iOS's large-title navigation bar, Material's large top app bar on Android.",
  anatomy: [
    "A control row (44 pt on iOS, 64 dp on Android) for leading and trailing controls",
    "Expanded: the large title below, 34/41 bold on iOS and 32/40 on Android",
    "Collapsed: one row; the title inline, centered on iOS and from the start on Android",
    "Usually a back control leading and the account avatar trailing",
  ],
  tokens: [
    "system.barHeight",
    "type.largeTitle",
    "type.headline",
    "type.title2",
    "space.margin",
    "color.background",
    "color.surface",
    "color.separator",
  ],
  states: ["expanded", "collapsed"],
  accessibility: [
    "The title is the screen's one h1, expanded or collapsed",
    "Leading and trailing controls keep their own names and targets",
    "Long titles wrap; the bar grows instead of truncating",
  ],
  motion: ["Collapses as the screen scrolls, following the scroll; nothing animates on its own"],
  native: {
    ios: "NavigationStack with .navigationTitle(title) and .navigationBarTitleDisplayMode(.large); .toolbar items for leading and trailing; the system collapses the title on scroll",
    android:
      "LargeTopAppBar with TopAppBarDefaults.exitUntilCollapsedScrollBehavior(), navigationIcon and actions",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    { version: "1.0.0", date: "2026-10-29", summary: "First version: expanded and collapsed." },
  ],
};
