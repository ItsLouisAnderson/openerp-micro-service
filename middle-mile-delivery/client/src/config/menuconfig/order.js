export const order = {
    id: "MENU_ORDER",
    icon: "LocalPostOfficeIcon",
    text: "Order",
    child: [
        {
            id: "MENU_ORDER.ALL",
            path: "/order/all",
            isPublic: true,
            text: "All Orders",
            child: []
        },
        {
            id: "MENU_ORDER.TRACK",
            path: "/order/track",
            isPublic: true,
            text: "Track by ID",
            child: []
        },
        {
            id: "MENU_ORDER.CREATE",
            path: "/order/create",
            isPublic: true,
            text: "New Order",
            child: []
        }
    ]
}