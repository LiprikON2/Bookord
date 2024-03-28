import React from "react";
import {
    createHashHistory,
    RouterProvider,
    createRouter,
    createRootRoute,
    createRoute,
} from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { Library, Reading, Test } from "~/renderer/scenes";
import { isDev } from "~/common/helpers";
import { Root } from "./appRoot";

// Only importing and using Devtools in Development
const TanStackRouterDevtools = isDev()
    ? React.lazy(() =>
          // Lazy load in development
          import("@tanstack/router-devtools").then((res) => ({
              default: res.TanStackRouterDevtools,
          }))
      )
    : (): any => null; // Render nothing in production

export const rootRoute = createRootRoute({
    component: Root,
});

export const libraryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Library,
});

export const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "about",
});

export const aboutIndexRoute = createRoute({
    getParentRoute: () => aboutRoute,
    path: "/",
    component: Test,
});

export const readingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "reading",
});

export const bookKeyRoute = createRoute({
    getParentRoute: () => readingRoute,
    path: "$bookKey",
    component: Reading,
});

/* prettier-ignore */
const routeTree = rootRoute.addChildren([
    libraryRoute,
    aboutRoute.addChildren([aboutIndexRoute]),
    readingRoute.addChildren([bookKeyRoute]),
]);
/* prettier-ignore-end */

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
    interface Register {
        // This infers the type of our router and registers it across your entire project
        router: typeof router;
    }
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <TanStackRouterDevtools router={router} position="bottom-right" />
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}
