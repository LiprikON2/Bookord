import { action, observable, autorun, set, toJS } from "mobx";
import _ from "lodash";

import { isDev } from "~/common/helpers";
import { type SettingsState } from "~/renderer/scenes/Settings";

declare global {
    interface Window {
        booksStore?: typeof booksStore;
    }
}

let booksStore = observable<SettingsState>({});
let isInitialized = false;

export const getBooksStore = (initBooks: any = {}) => {
    if (!isInitialized) {
        setSettingsStore(initBooks);
        isInitialized = true;

        autorun(
            () => {
                console.log("[Update]: booksStore");
                if (isDev()) window["booksStore"] = toJS(booksStore);
            },
            { delay: 200 }
        );
    }

    return booksStore;
};

export const setSettingsStore = action((books: any) => set(booksStore, "data", books));
