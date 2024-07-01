package openerp.openerpresourceserver.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.DailyStatistics;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    private List<DailyStatistics> dailyStats;
    private DailyStatistics todaysStats;
    private int totalOrders, totalFinishedOrder;
    private int totalTrips, totalFinishedTrips;
    private int plannedTrips, departedTrips, canceledTrips;
    private int atStartLocalHubOrders, atStartRegionalHubOrders, atEndRegionalHubOrders, transportingOrders;
}
