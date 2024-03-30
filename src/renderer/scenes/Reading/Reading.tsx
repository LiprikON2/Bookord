import React from "react";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { useOpenedBooks } from "~/renderer/hooks";
// import { getRouteApi } from "@tanstack/react-router";
// const bookKeyApi = getRouteApi("/reading/$bookKey");

// TODO
// https://tanstack.com/router/latest/docs/framework/react/guide/router-context#how-about-an-external-data-fetching-library
export const Reading = () => {
    const { bookKey } = bookKeyRoute.useParams();
    const { openedBook } = useOpenedBooks(bookKey);

    return <h1>hello {bookKey}</h1>;
};
