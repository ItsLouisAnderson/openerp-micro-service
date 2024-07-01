export const tripTypes = [
    "LOCAL_TO_REGIONAL",
    "REGIONAL_TO_REGIONAL",
    "REGIONAL_TO_LOCAL"
]

export const tripTypeDisplayValue = (type) => {
    switch (type) {
        case "REGIONAL_TO_REGIONAL":
            return "Regional Hub to Regional Hub (Line Haul)";
        case "LOCAL_TO_REGIONAL":
            return "Local Hub to Regional Hub";
        case "REGIONAL_TO_LOCAL":
            return "Regional Hub to Local Hub";
        default:
            return "Invalid type";
    }
}