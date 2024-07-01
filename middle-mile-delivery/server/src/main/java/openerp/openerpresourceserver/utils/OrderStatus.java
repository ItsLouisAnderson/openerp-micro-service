package openerp.openerpresourceserver.utils;

public enum OrderStatus {
    AT_START_LOCAL_HUB("AT_START_LOCAL_HUB"),
    TRANSPORTING_TO_START_REGIONAL_HUB("TRANSPORTING_TO_START_REGIONAL_HUB"),
    AT_START_REGIONAL_HUB("AT_START_REGIONAL_HUB"),
    TRANSPORTING_TO_END_REGIONAL_HUB("TRANSPORTING_TO_END_REGIONAL_HUB"),
    AT_END_REGIONAL_HUB("AT_END_REGIONAL_HUB"),
    TRANSPORTING_TO_END_LOCAL_HUB("TRANSPORTING_TO_END_LOCAL_HUB"),
    AT_END_LOCAL_HUB("AT_END_LOCAL_HUB");

    private final String code;

    OrderStatus(String code) {
        this.code = code;
    }
    public String getCode() {
        return code;
    }
}
