import React from "react";
import {
    createHashHistory,
    RouterProvider,
    createRouter,
    createRootRoute,
    createRoute,
    redirect,
} from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { Library, Reading, About } from "~/renderer/scenes";
import { isDev } from "~/common/helpers";
import { Root } from "./appRoot";
import { LayoutLibrary, LayoutReading } from "./layouts";

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

// Since initial url is always `http://localhost:3000/app_window#/` there is a need
// to redirect to the home view `http://localhost:3000/app_window#/library-layout/library`
export const redirectRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    loader: () => {
        redirect({
            to: libraryRoute.to,
            throw: true,
        });
    },
});

export const layoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: "layout",
});
export const layoutLibraryRoute = createRoute({
    getParentRoute: () => layoutRoute,
    component: LayoutLibrary,
    path: "layout-library",
});
export const layoutReadingRoute = createRoute({
    getParentRoute: () => layoutRoute,
    component: LayoutReading,
    path: "layout-reading",
});

export const libraryRoute = createRoute({
    getParentRoute: () => layoutLibraryRoute,
    path: "/library",
    component: Library,
});

export const aboutRoute = createRoute({
    getParentRoute: () => layoutLibraryRoute,
    path: "about",
});

export const aboutIndexRoute = createRoute({
    getParentRoute: () => aboutRoute,
    path: "/",
    component: About,
});

export const readingRoute = createRoute({
    getParentRoute: () => layoutReadingRoute,
    path: "reading",
});

export const bookKeyRoute = createRoute({
    getParentRoute: () => readingRoute,
    path: "$bookKey",
    component: Reading,
});

// TODO consider https://tanstack.com/router/latest/docs/framework/react/decisions-on-dx

/* prettier-ignore */
const routeTree = rootRoute.addChildren([
    redirectRoute,
    layoutRoute.addChildren([
        layoutLibraryRoute.addChildren([
            libraryRoute,
            aboutRoute.addChildren([aboutIndexRoute]),
        ]),
        layoutReadingRoute.addChildren([
            readingRoute.addChildren([bookKeyRoute]),
        ])
    ])
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
