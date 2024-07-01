export const trip = {
    id: "MENU_TRIP",
    icon: "MultipleStopIcon",
    text: "Delivery Trip",
    child: [
        {
            id: "MENU_TRIP.PLANNED",
            path: "/trip/planned",
            isPublic: true,
            text: "Planned",
            child: []
        },
        {
            id: "MENU_TRIP.DEPARTED",
            path: "/trip/departed",
            isPublic: true,
            text: "Departed",
            child: []
        },
        {
            id: "MENU_TRIP.ARRIVED",
            path: "/trip/arrived",
            isPublic: true,
            text: "Arrived",
            child: []
        },
        {
            id: "MENU_TRIP.CREATE",
            path: "/trip/create",
            isPublic: true,
            text: "New Trip",
            child: []
        }
    ]
}