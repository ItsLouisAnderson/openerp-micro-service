export const hub = {
    id: "MENU_HUB",
    icon: "HubIcon",
    text: "Hub",
    child: [
        {
            id: "MENU_HUB.REGIONAL_HUB",
            path: "/hub/regional",
            isPublic: true,
            text: "Regional Hubs",
            child: [],
        },
        {
            id: "MENU_HUB.LOCAL_HUB",
            path: "/hub/local",
            isPublic: true,
            text: "Local Hubs",
            child: [],
        }
    ],
};