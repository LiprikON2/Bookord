import { useRootStore } from "./useRootStore";

export const useBookStore = () => {
    const { bookStore } = useRootStore();
    return bookStore;
};
