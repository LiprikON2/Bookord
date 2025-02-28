import { render, cleanup, act, waitFor } from "@testing-library/react";
import { Mock, vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { Giscus } from "./Giscus";
import React from "react";

// Mock all dependencies
vi.mock("@giscus/react", () => ({
    default: vi
        .fn()
        .mockImplementation((props) => <div data-testid="giscus-component" {...props} />),
}));

vi.mock("~/renderer/ipc/thirdPartyApi", () => ({
    default: {
        handleOauthGiscus: vi.fn(),
    },
}));

vi.mock("~/renderer/hooks", () => ({
    useColorScheme: vi.fn().mockReturnValue({ colorScheme: "light" }),
}));

vi.mock("@mantine/hooks", () => ({
    useLocalStorage: vi.fn().mockImplementation(({ key }) => {
        return ["test-session", vi.fn()];
    }),
    useWindowEvent: vi.fn(),
}));

import context from "~/renderer/ipc/thirdPartyApi";
import { useColorScheme } from "~/renderer/hooks";
import { useLocalStorage } from "@mantine/hooks";

describe("Giscus Component", () => {
    const mockSetGiscusParam = vi.fn();

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Setup default mock implementations
        (useLocalStorage as Mock).mockReturnValue(["test-session", mockSetGiscusParam]);
        (useColorScheme as Mock).mockReturnValue({ colorScheme: "light" });
        (context.handleOauthGiscus as Mock).mockImplementation((callback) => {
            callback("test-param");
            return () => {}; // cleanup function
        });
    });

    afterEach(() => {
        cleanup();
    });

    it("renders with correct default props", () => {
        const { getByTestId } = render(<Giscus />);

        const giscusElement = getByTestId("giscus-component");

        // Test required props
        expect(giscusElement).toHaveAttribute("repo", "LiprikON2/Bookord");
        expect(giscusElement).toHaveAttribute("repoId", "R_kgDOLtwkCA");
        expect(giscusElement).toHaveAttribute("category", "In-app book comments");
        expect(giscusElement).toHaveAttribute("theme", "light");
    });

    it("initializes OAuth listener on mount", () => {
        render(<Giscus />);

        expect(context.handleOauthGiscus).toHaveBeenCalled();
    });

    it("updates giscus param when OAuth callback is received", () => {
        render(<Giscus />);

        act(() => {
            // Get the callback function passed to handleOauthGiscus
            const oauthCallback = (context.handleOauthGiscus as Mock).mock.calls[0][0];
            // Call it with new param
            oauthCallback("new-param");
        });

        expect(mockSetGiscusParam).toHaveBeenCalledWith("new-param");
    });

    it("cleans up OAuth listener on unmount", () => {
        const mockCleanup = vi.fn();
        (context.handleOauthGiscus as Mock).mockReturnValue(mockCleanup);

        const { unmount } = render(<Giscus />);
        unmount();

        expect(mockCleanup).toHaveBeenCalled();
    });
});
