import { autorun, toJS } from "mobx";

import { BookStoreData } from "../BookStore";

export const autosave = (store: BookStoreData, save: (store: BookStoreData) => void) => {
    let firstRun = true;
    autorun(() => {
        // This code will run every time any observable property
        // on the store is updated.
        const data = JSON.parse(JSON.stringify(toJS(store)));
        if (!firstRun) save(data);

        firstRun = false;
    });
};
