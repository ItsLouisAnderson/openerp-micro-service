package openerp.openerpresourceserver.service.truck;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.TruckInsertDTO;
import openerp.openerpresourceserver.entity.Truck;
import openerp.openerpresourceserver.entity.hub.Hub;
import openerp.openerpresourceserver.entity.hub.RegionalHub;
import openerp.openerpresourceserver.repo.TruckRepo;
import openerp.openerpresourceserver.repo.hub.HubRepo;
import openerp.openerpresourceserver.repo.hub.RegionalHubRepo;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class TruckServiceImpl implements TruckService {
    
    private TruckRepo truckRepo;

    private HubRepo hubRepo;

    @Override
    public List<Truck> getAllTrucks() {
        List<Truck> trucks = truckRepo.findAll();
        return trucks;
    }

    @Override
    public List<Truck> getByHubId(Long hubId) {
        Optional<Hub> hub = hubRepo.findById(hubId);
        if (hub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + hubId + " does not exist");
        }

        return truckRepo.findByHub(hub.get());
    }

    @Override
    public Truck getById(String licensePlate) {
        Optional<Truck> truck = truckRepo.findById(licensePlate);

        if (truck.isEmpty()) {
            throw new NoSuchElementException("Truck with plate number " + licensePlate + " does not exist");
        }

        return truck.get();
    }

    @Override
    public Truck save(TruckInsertDTO truck) {
        Optional<Hub> hub = hubRepo.findById(truck.getHubId());

        if (hub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + truck.getHubId() + " does not exist");
        }

        Truck newTruck = Truck.builder()
            .licensePlate(truck.getLicensePlate())
            .manufacturer(truck.getManufacturer())
            .maxWeight(truck.getMaxWeight())
            .hub(hub.get())
            .build();

        return truckRepo.save(newTruck);
    }

    @Override
    public Truck update(String licensePlate, TruckInsertDTO truckUpdate) {
        Optional<Truck> truck = truckRepo.findById(licensePlate);
        if (truck.isEmpty()) {
            throw new NoSuchElementException("Truck with plate number " + licensePlate + " does not exist");
        }

        Optional<Hub> newHub = hubRepo.findById(truckUpdate.getHubId());
        if (newHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + truckUpdate.getHubId() + " does not exist");
        }

        Truck truckData = truck.get();
        truckData.setLicensePlate(truckUpdate.getLicensePlate());
        truckData.setManufacturer(truckUpdate.getManufacturer());
        truckData.setMaxWeight(truckUpdate.getMaxWeight());
        truckData.setHub(newHub.get());
        
        return truckRepo.save(truckData);
    }

    @Override
    public void remove(String licensePlate) {
        truckRepo.deleteById(licensePlate);
    }
}
