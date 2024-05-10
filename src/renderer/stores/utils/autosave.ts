import { autorun, toJS } from "mobx";

import { BookStoreData } from "../BookStore";

// ref: https://stackoverflow.com/a/40326316/10744339
export const autosave = (store: BookStoreData, save: (store: BookStoreData) => void) => {
    let firstRun = true;
    autorun(
        () => {
            // This code will run every time any observable property
            // on the store is updated.
            const data = JSON.parse(JSON.stringify(toJS(store)));
            if (!firstRun) save(data);

            firstRun = false;
        },
        { delay: 500 }
    );
};
