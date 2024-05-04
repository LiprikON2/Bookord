import { useContext } from "react";
import { RootStoreContext } from "../RootStoreContext";

export const useRootStore = () => {
    const rootStore = useContext(RootStoreContext);
    return rootStore;
};
