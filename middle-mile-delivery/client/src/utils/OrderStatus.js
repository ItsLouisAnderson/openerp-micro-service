export const orderStatuses = [
    "AT_START_LOCAL_HUB",
    "TRANSPORTING_TO_START_REGIONAL_HUB",
    "AT_START_REGIONAL_HUB",
    "TRANSPORTING_TO_END_REGIONAL_HUB",
    "AT_END_REGIONAL_HUB",
    "TRANSPORTING_TO_END_LOCAL_HUB",
    "AT_END_LOCAL_HUB"
];

export const orderStatusDisplayValue = status => {
    switch (status) {
        case "AT_START_LOCAL_HUB":
            return "Arrived at the starting local hub";
        case "TRANSPORTING_TO_START_REGIONAL_HUB":
            return "Transporting to the starting regional hub";
        case "AT_START_REGIONAL_HUB":
            return "Arrived at the starting regional hub";
        case "TRANSPORTING_TO_END_REGIONAL_HUB":
            return "Transporting to the ending regional hub";
        case "AT_END_REGIONAL_HUB":
            return "Arrived at the ending regional hub";
        case "TRANSPORTING_TO_END_LOCAL_HUB":
            return "Transporting to the ending local hub"
        case "AT_END_LOCAL_HUB":
            return "Arrived at the ending local hub";
        default:
            return "Undefined status";
    }
}