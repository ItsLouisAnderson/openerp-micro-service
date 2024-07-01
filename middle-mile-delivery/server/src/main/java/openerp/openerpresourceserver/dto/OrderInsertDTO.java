package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.utils.OrderStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderInsertDTO {
    private String description;
    private Long startHubId, endHubId;
    private OrderStatus status;
    private int weight;
}
