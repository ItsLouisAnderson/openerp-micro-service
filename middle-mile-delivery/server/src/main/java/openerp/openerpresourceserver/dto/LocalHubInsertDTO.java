package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalHubInsertDTO {
    private String name;
    private double lat, lon;
    private long regionalHubId;
}
