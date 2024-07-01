package openerp.openerpresourceserver.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.dto.TripInsertDTO;
import openerp.openerpresourceserver.entity.Trip;
import openerp.openerpresourceserver.service.trip.TripService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/trip")
public class TripController {
    
    private TripService tripService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllTrips() {
        List<Trip> trips = tripService.getAllTrips();
        return ResponseEntity.ok().body(trips);
    }

    @GetMapping("/planned")
    public ResponseEntity<?> getPlannedTrips() {
        List<Trip> trips = tripService.getPlannedTrips();
        return ResponseEntity.ok().body(trips);
    }

    @GetMapping("/departed")
    public ResponseEntity<?> getDepartedTrips() {
        List<Trip> trips = tripService.getDepartedTrips();
        return ResponseEntity.ok().body(trips);
    }

    @GetMapping("/arrived")
    public ResponseEntity<?> getArrivedTrips() {
        List<Trip> trips = tripService.getArrivedTrips();
        return ResponseEntity.ok().body(trips);
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodaysTrips() {
        List<Trip> trips = tripService.getTodaysTrips();
        return ResponseEntity.ok().body(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getById(id);
        return ResponseEntity.ok().body(trip);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripInsertDTO trip) {
        Trip savedTrip = tripService.save(trip);
        return ResponseEntity.ok().body(savedTrip);
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> editTrip(@PathVariable Long id, @Valid @RequestBody TripInsertDTO tripUpdate) {
        Trip savedTrip = null;
        try {
            savedTrip = tripService.update(id, tripUpdate);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedTrip);
    }

    @PostMapping("/depart/{id}")
    public ResponseEntity<?> departTrip(@PathVariable Long id) {
        Trip savedTrip = null;
        try {
            savedTrip = tripService.depart(id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedTrip);
    }

    @PostMapping("/arrive/{id}")
    public ResponseEntity<?> arriveTrip(@PathVariable Long id) {
        Trip savedTrip = null;
        try {
            savedTrip = tripService.arrive(id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedTrip);
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelTrip(@PathVariable Long id) {
        Trip canceledTrip = null;
        try {
            canceledTrip = tripService.cancel(id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(canceledTrip);
    }

}
