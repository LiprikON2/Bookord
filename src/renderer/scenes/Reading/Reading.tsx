import React from "react";

import { bookKeyRoute } from "~/renderer/appRenderer";
// import { getRouteApi } from "@tanstack/react-router";
// const bookKeyApi = getRouteApi("/reading/$bookKey");

export const Reading = () => {
    const { bookKey } = bookKeyRoute.useParams();
    return <h1>hello {bookKey}</h1>;
};
