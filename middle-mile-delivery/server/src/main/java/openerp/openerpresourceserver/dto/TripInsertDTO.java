package openerp.openerpresourceserver.dto;

import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.utils.TripStatus;
import openerp.openerpresourceserver.utils.TripType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripInsertDTO {
    private Long startHubId, endHubId;
    private String truckId;
    private String startTime, startDate;
    private TripStatus status;
    private TripType type;
    private List<Long> orderIds;
}
