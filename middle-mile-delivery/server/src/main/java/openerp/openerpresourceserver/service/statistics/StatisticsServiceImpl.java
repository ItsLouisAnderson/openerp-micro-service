package openerp.openerpresourceserver.service.statistics;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.StatisticsDTO;
import openerp.openerpresourceserver.entity.DailyStatistics;
import openerp.openerpresourceserver.repo.DailyStatisticsRepo;
import openerp.openerpresourceserver.repo.OrderRepo;
import openerp.openerpresourceserver.repo.TripRepo;
import openerp.openerpresourceserver.utils.OrderStatus;
import openerp.openerpresourceserver.utils.TripStatus;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class StatisticsServiceImpl implements StatisticsService {
    
    private DailyStatisticsRepo dailyStatisticsRepo;

    private OrderRepo orderRepo;

    private TripRepo tripRepo;

    @Override
    public StatisticsDTO getTodaysStatistics() {
        StatisticsDTO result = new StatisticsDTO();

        LocalDate today = LocalDate.now();
        Optional<DailyStatistics> todaysStats = dailyStatisticsRepo.findById(today);
        if (todaysStats.isEmpty()) {
            DailyStatistics newTodaysStats = DailyStatistics.builder().date(today).build();
            newTodaysStats = dailyStatisticsRepo.save(newTodaysStats);
            result.setTodaysStats(newTodaysStats);
        } else {
            result.setTodaysStats(todaysStats.get());
        }

        List<DailyStatistics> lastDaysStats = dailyStatisticsRepo.getLastDaysStatistics(5);
        result.setDailyStats(lastDaysStats);

        result.setTotalOrders(dailyStatisticsRepo.getTotalOrdersMade());
        result.setTotalTrips(dailyStatisticsRepo.getTotalTripsMade());
        result.setTotalFinishedOrder(dailyStatisticsRepo.getTotalOrdersFinished());
        result.setTotalFinishedTrips(dailyStatisticsRepo.getTotalTripsFinished());

        result.setPlannedTrips(tripRepo.findCountByStatus(TripStatus.PLANNED));
        result.setDepartedTrips(tripRepo.findCountByStatus(TripStatus.DEPARTED));
        result.setCanceledTrips(tripRepo.findCountByStatus(TripStatus.CANCELED));

        result.setAtStartLocalHubOrders(orderRepo.findCountByStatus(OrderStatus.AT_START_LOCAL_HUB));
        result.setAtStartRegionalHubOrders(orderRepo.findCountByStatus(OrderStatus.AT_START_REGIONAL_HUB));
        result.setAtEndRegionalHubOrders(orderRepo.findCountByStatus(OrderStatus.AT_END_REGIONAL_HUB));
        result.setTransportingOrders(orderRepo.findCountTransporting());

        return result;
    }
}
