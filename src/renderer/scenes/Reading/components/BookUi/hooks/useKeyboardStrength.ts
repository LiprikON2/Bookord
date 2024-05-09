import { useMetaKeysHeld } from "./useMetaKeysHeld";

export const useKeyboardStrength = () => {
    const shiftOrCtrlHeld = useMetaKeysHeld({ ctrlKey: true, shiftKey: true }, "or");
    const altHeld = useMetaKeysHeld({ altKey: true });
    const shiftOrCtrlAndAltHeld = shiftOrCtrlHeld && altHeld;

    if (shiftOrCtrlAndAltHeld) return "high";
    if (shiftOrCtrlHeld) return "medium";
    return "low";
};
