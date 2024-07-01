package openerp.openerpresourceserver.utils;

public enum TripStatus {
    PLANNED("PLANNED"),
    DEPARTED("DEPARTED"),
    ARRIVED("ARRIVED"),
    CANCELED("CANCELED");

    private final String code;

    TripStatus(String code) {
        this.code = code;
    }
    public String getCode() {
        return code;
    }
}
