export type TitlebarMenuItem = {
    name: string;
    action?: string;
    shortcut?: string;
    value?: string | number;
    items?: TitlebarMenuItem[];
};

export type TitlebarMenu = {
    name: string;
    items: TitlebarMenuItem[];
};

const titlebarMenus: TitlebarMenu[] = [
    {
        name: "File",
        items: [
            {
                name: "Exit",
                action: "exit",
            },
        ],
    },
    {
        name: "Edit",
        items: [
            {
                name: "Undo",
                action: "undo",
                shortcut: "Ctrl+Z",
            },
            {
                name: "Redo",
                action: "redo",
                shortcut: "Ctrl+Y",
            },
            {
                name: "__",
            },
            {
                name: "Cut",
                action: "cut",
                shortcut: "Ctrl+X",
            },
            {
                name: "Copy",
                action: "copy",
                shortcut: "Ctrl+C",
            },
            {
                name: "Paste",
                action: "paste",
                shortcut: "Ctrl+V",
            },
            {
                name: "Delete",
                action: "delete",
            },
            {
                name: "__",
            },
            {
                name: "Select All",
                action: "selectAll",
                shortcut: "Ctrl+A",
            },
        ],
    },
    {
        name: "View",
        items: [
            {
                name: "Reload",
                action: "reload",
                shortcut: "Ctrl+R",
            },
            {
                name: "Force Reload",
                action: "forceReload",
                shortcut: "Ctrl+Shift+R",
            },
            {
                name: "Toogle Developer Tools",
                action: "toggleDevtools",
                shortcut: "Ctrl+Shift+I",
            },
            {
                name: "__",
            },
            {
                name: "Actual Size",
                action: "actualSize",
                shortcut: "Ctrl+0",
            },
            {
                name: "Zoom In",
                action: "zoomIn",
                shortcut: "Ctrl++",
            },
            {
                name: "Zoom Out",
                action: "zoomOut",
                shortcut: "Ctrl+-",
            },
            {
                name: "__",
            },
            {
                name: "Toggle Fullscreen",
                action: "toggleFullscreen",
                shortcut: "F11",
            },
        ],
    },
    {
        name: "Window",
        items: [
            {
                name: "Minimize",
                action: "minimize",
                shortcut: "Ctrl+M",
            },
            {
                name: "Close",
                action: "exit",
                shortcut: "Ctrl+W",
            },
        ],
    },
];

export default titlebarMenus;
