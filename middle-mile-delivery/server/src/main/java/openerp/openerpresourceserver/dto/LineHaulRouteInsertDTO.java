package openerp.openerpresourceserver.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LineHaulRouteInsertDTO {
    private String name;
    private Long startHubId, endHubId;
    private List<String> startTimes;
}
