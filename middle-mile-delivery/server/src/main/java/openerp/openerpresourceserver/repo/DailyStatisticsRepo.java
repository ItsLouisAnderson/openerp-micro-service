package openerp.openerpresourceserver.repo;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.DailyStatistics;
import java.util.List;

@Repository
public interface DailyStatisticsRepo extends JpaRepository<DailyStatistics, LocalDate> {

    @Query(value = "SELECT ds.* FROM mmd_daily_statistics ds ORDER BY ds.date DESC LIMIT ?1", nativeQuery = true)
    List<DailyStatistics> getLastDaysStatistics(int days);

    @Query(value = "SELECT SUM(ds.orders_made) FROM mmd_daily_statistics ds", nativeQuery = true)
    int getTotalOrdersMade();

    @Query(value = "SELECT SUM(ds.orders_finished) FROM mmd_daily_statistics ds", nativeQuery = true)
    int getTotalOrdersFinished();

    @Query(value = "SELECT SUM(ds.trips_made) FROM mmd_daily_statistics ds", nativeQuery = true)
    int getTotalTripsMade();

    @Query(value = "SELECT SUM(ds.trips_finished) FROM mmd_daily_statistics ds", nativeQuery = true)
    int getTotalTripsFinished();
}
