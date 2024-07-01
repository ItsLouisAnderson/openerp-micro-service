package openerp.openerpresourceserver.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.dto.TruckInsertDTO;
import openerp.openerpresourceserver.entity.Truck;
import openerp.openerpresourceserver.service.truck.TruckService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/truck")
public class TruckController {
    
    private TruckService truckService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllTrucks() {
        List<Truck> trucks = truckService.getAllTrucks();
        return ResponseEntity.ok().body(trucks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTruckById(@PathVariable String id) {
        Truck truck = truckService.getById(id);
        return ResponseEntity.ok().body(truck);
    }

    @GetMapping("/get-by-hub/{hubId}")
    public ResponseEntity<?> getTrucksByHubId(@PathVariable Long hubId) {
        List<Truck> trucks = truckService.getByHubId(hubId);
        return ResponseEntity.ok().body(trucks);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTruck(@Valid @RequestBody TruckInsertDTO truck) {
        Truck savedTruck = truckService.save(truck);
        return ResponseEntity.ok().body(savedTruck);
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> editTruck(@PathVariable String id, @Valid @RequestBody TruckInsertDTO truckUpdate){
        Truck savedTruck = null;
        try {
            savedTruck = truckService.update(id, truckUpdate);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedTruck);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteTruck(@PathVariable String id){
        truckService.remove(id);
        return ResponseEntity.ok().body(null);
    }
    
}
