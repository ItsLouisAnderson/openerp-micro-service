export const tripStatuses = [
    "PLANNED",
    "DEPARTED",
    "ARRIVED",
    "CANCELED"
]

export const tripStatusDisplayValue = status => {
    switch (status) {
        case "PLANNED":
            return "Planned";
        case "DEPARTED":
            return "Departed";
        case "ARRIVED":
            return "Arrived";
        case "CANCELED":
            return "Canceled";
        default:
            return "Invalid status";
    }
}