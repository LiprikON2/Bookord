import { useRootStore } from "./useRootStore";

export const useBookReadStore = () => {
    const { bookReadStore } = useRootStore();
    return bookReadStore;
};
