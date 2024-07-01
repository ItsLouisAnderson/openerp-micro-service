package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruckInsertDTO {
    private String licensePlate, manufacturer;
    private int maxWeight;
    private Long hubId;
}
