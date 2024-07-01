package openerp.openerpresourceserver.service.truck;

import java.util.List;

import openerp.openerpresourceserver.dto.TruckInsertDTO;
import openerp.openerpresourceserver.entity.Truck;

public interface TruckService {
    
    List<Truck> getAllTrucks();

    List<Truck> getByHubId(Long hubId);

    Truck getById(String licensePlate);

    Truck save(TruckInsertDTO truck);

    Truck update(String licensePlate, TruckInsertDTO truckUpdate);

    void remove(String licensePlate);
}
