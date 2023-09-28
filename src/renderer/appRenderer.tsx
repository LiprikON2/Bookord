import React from "react";
import {
    RootRoute,
    Route,
    Router,
    createHashHistory,
    createMemoryHistory,
} from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { Root } from "./appRoot";
import { Library, Test } from "./scenes";
import { isDev } from "~/common/helpers";

// Only importing and using Devtools in Development
const TanStackRouterDevtools = isDev()
    ? React.lazy(() =>
          // Lazy load in development
          import("@tanstack/router-devtools").then((res) => ({
              default: res.TanStackRouterDevtools,
          }))
      )
    : (): any => null; // Render nothing in production

export const rootRoute = new RootRoute({
    component: Root,
});

export const libraryRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Library,
});

export const testRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "test",
});

export const testIndexRoute = new Route({
    getParentRoute: () => testRoute,
    path: "/",
    component: Test,
});

const routeTree = rootRoute.addChildren([
    libraryRoute.addChildren([testRoute.addChildren([testIndexRoute])]),
]);

// const hashHistory = createHashHistory(); // Bugged
const memoryHistory = createMemoryHistory({
    initialEntries: ["/test"],
});

const router = new Router({ routeTree, history: memoryHistory });

createRoot(document.getElementById("app")).render(
    <>
        <TanStackRouterDevtools router={router} position="bottom-right" />
        <RouterProvider router={router} />
    </>
);

declare module "@tanstack/react-router" {
    interface Register {
        // This infers the type of our router and registers it across your entire project
        router: typeof router;
    }
}
