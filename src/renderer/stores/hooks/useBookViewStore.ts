import { useRootStore } from "./useRootStore";

export const useBookViewStore = () => {
    const { bookViewStore } = useRootStore();
    return bookViewStore;
};
