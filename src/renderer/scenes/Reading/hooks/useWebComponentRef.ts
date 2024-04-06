import { useCallback, useRef } from "react";

export const useWebComponentRef = (onMount: (webComponent: any) => void = () => {}) => {
    const webComponentRef = useRef<any>(null);

    const setWebComponentRef = useCallback((webComponent: any) => {
        if (webComponent) onMount(webComponent);

        // if (webComponent) {
        //     // @ts-ignore
        //     const bookSource = location?.state?.bookFile ? "location" : "last";

        //     // Send an IPC request to get config
        //     window.api.store.send(readConfigRequest, "recentBooks");

        //     // Listen for responses from the electron store
        //     window.api.store.onReceive(readConfigResponse, (args) => {
        //         // Check first if the requested book is already parsed
        //         // i.e. is currently in recent books
        //         if (args.key === "recentBooks" && args.success) {
        //             const retrivedRecentBooks = args.value ?? [];
        //             setRecentBooks.setState(retrivedRecentBooks);

        //             let parsedBook;
        //             if (retrivedRecentBooks.length) {
        //                 if (bookSource === "location") {
        //                     // Check if book from location is in recent books
        //                     // @ts-ignore
        //                     const bookName = location.state.bookFile.name;
        //                     retrivedRecentBooks.forEach((bookObj) => {
        //                         if (bookObj.name === bookName) {
        //                             parsedBook = bookObj;
        //                         }
        //                     });
        //                 } else if (bookSource === "last") {
        //                     // The last book in the list of recent books is the last opened book
        //                     parsedBook = retrivedRecentBooks[retrivedRecentBooks.length - 1];
        //                 }
        //                 if (parsedBook) {
        //                     loadBookComponent(parsedBook, true);
        //                 }
        //             }
        //             if (!parsedBook) {
        //                 window.api.store.send(readConfigRequest, "allBooks");
        //             }
        //         }
        //         // Provide unparsed book, last opened book are always parsed
        //         if (args.key === "allBooks" && args.success && bookSource === "location") {
        //             const allBooks = args.value;

        //             // @ts-ignore
        //             const bookName = location.state.bookFile.name;
        //             const bookObj = allBooks[bookName];

        //             loadBookComponent(bookObj);
        //         }
        //     });
        // }

        webComponentRef.current = webComponent;
    }, []);

    const refReadyDecorator = (callback: (bookComponent: React.MutableRefObject<any>) => void) => {
        const bookComponent = webComponentRef.current;
        if (bookComponent) callback(bookComponent);
    };

    return [webComponentRef, setWebComponentRef, refReadyDecorator] as [
        typeof webComponentRef,
        typeof setWebComponentRef,
        typeof refReadyDecorator
    ];
};
