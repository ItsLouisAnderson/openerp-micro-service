package openerp.openerpresourceserver.service.trip;

import java.util.List;

import openerp.openerpresourceserver.dto.TripInsertDTO;
import openerp.openerpresourceserver.entity.Trip;

public interface TripService {
    
    List<Trip> getAllTrips();

    List<Trip> getPlannedTrips();

    List<Trip> getDepartedTrips();

    List<Trip> getArrivedTrips();
    
    List<Trip> getTodaysTrips();

    Trip getById(Long id);

    Trip save(TripInsertDTO trip);

    Trip update(Long id, TripInsertDTO tripUpdate);

    Trip depart(Long id);

    Trip arrive(Long id);

    Trip cancel(Long id);
}
