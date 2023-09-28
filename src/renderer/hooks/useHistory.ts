import { useRouter } from "@tanstack/react-router";

export const useHistory = () => {
    const router = useRouter();
    const { pathname } = router.history.location;

    return { history, location, currentPath: pathname };
};
