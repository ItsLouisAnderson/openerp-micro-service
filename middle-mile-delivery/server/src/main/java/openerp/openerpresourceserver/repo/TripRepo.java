package openerp.openerpresourceserver.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.Trip;
import java.time.LocalDate;
import openerp.openerpresourceserver.utils.TripStatus;



@Repository
public interface TripRepo extends JpaRepository<Trip, Long> {
    
    List<Trip> findByStartDate(LocalDate startDate);

    List<Trip> findByStatus(TripStatus status);

    @Query(value = "SELECT COUNT(t.*) FROM mmd_trip t WHERE t.status = :#{#status?.getCode()}", nativeQuery = true)
    int findCountByStatus(@Param("status") TripStatus status);
}
