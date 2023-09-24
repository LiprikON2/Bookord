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
import { Application } from "./Application";

const rootRoute = new RootRoute({
    component: Root,
});

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <Application />,
});

const blogRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "blog",
});

const blogIndexRoute = new Route({
    getParentRoute: () => blogRoute,
    path: "/",
    component: () => <h1>blogIndexRoute</h1>,
});

const routeTree = rootRoute.addChildren([
    indexRoute.addChildren([blogRoute.addChildren([blogIndexRoute])]),
]);

// Hash routing can be helpful if your server doesn't support rewrites to index.html for HTTP requests
// (among other environments that don't have a server).
const hashHistory = createHashHistory();

const memoryHistory = createMemoryHistory({
    initialEntries: ["/"], // Pass your initial url
});

const router = new Router({ routeTree, history: memoryHistory });

createRoot(document.getElementById("app")).render(<RouterProvider router={router} />);

declare module "@tanstack/react-router" {
    interface Register {
        // This infers the type of our router and registers it across your entire project
        router: typeof router;
    }
}
