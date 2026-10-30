import { createBrowserRouter } from "react-router";
// The DOM build of RouterProvider, so navigations can use flushSync.
import { RouterProvider } from "react-router/dom";
import { PhonePage } from "@prototype/shell/PhonePage";
import { PrototypePage } from "@prototype/shell/PrototypePage";
import { WorkspaceLayout } from "@workspace/WorkspaceLayout";
import { Changelog } from "@workspace/pages/Changelog";
import { Guideline } from "@workspace/pages/Guideline";
import { LabComponent } from "@workspace/pages/LabComponent";
import { LabIndex } from "@workspace/pages/LabIndex";
import { LibraryComponent } from "@workspace/pages/LibraryComponent";
import { LibraryIndex } from "@workspace/pages/LibraryIndex";
import { NotFound } from "@workspace/pages/NotFound";
import { Overview } from "@workspace/pages/Overview";

// An earlier release is served under /__releases/<version>/; its routes start there.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

const router = createBrowserRouter(
  [
    // Each phone of the review shell runs in its own document, outside the workspace chrome. Any
    // other phone is an unknown address, so it gets the workspace's Not found page.
    { path: "/prototype/phone/alex", element: <PhonePage id="alex" /> },
    { path: "/prototype/phone/sarah", element: <PhonePage id="sarah" /> },
    {
      element: <WorkspaceLayout />,
      children: [
        { path: "/", element: <Overview /> },
        { path: "/guideline", element: <Guideline /> },
        { path: "/library", element: <LibraryIndex /> },
        { path: "/library/:id", element: <LibraryComponent /> },
        { path: "/lab", element: <LabIndex /> },
        { path: "/lab/:id", element: <LabComponent /> },
        { path: "/prototype", element: <PrototypePage /> },
        { path: "/changelog", element: <Changelog /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  basename ? { basename } : undefined,
);

export function App() {
  return <RouterProvider router={router} />;
}
