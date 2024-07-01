package openerp.openerpresourceserver.service.trip;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.TripInsertDTO;
import openerp.openerpresourceserver.entity.Order;
import openerp.openerpresourceserver.entity.DailyStatistics;
import openerp.openerpresourceserver.entity.LineHaulRoute;
import openerp.openerpresourceserver.entity.Trip;
import openerp.openerpresourceserver.entity.Truck;
import openerp.openerpresourceserver.entity.hub.Hub;
import openerp.openerpresourceserver.repo.OrderRepo;
import openerp.openerpresourceserver.repo.DailyStatisticsRepo;
import openerp.openerpresourceserver.repo.LineHaulRouteRepo;
import openerp.openerpresourceserver.repo.TripRepo;
import openerp.openerpresourceserver.repo.TruckRepo;
import openerp.openerpresourceserver.repo.hub.HubRepo;
import openerp.openerpresourceserver.utils.OrderStatus;
import openerp.openerpresourceserver.utils.TripStatus;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class TripServiceImpl implements TripService {
    
    private TripRepo tripRepo;

    private HubRepo hubRepo;

    private TruckRepo truckRepo;

    private OrderRepo orderRepo;

    private DailyStatisticsRepo dailyStatisticsRepo;

    @Override
    public List<Trip> getAllTrips() {
        List<Trip> trips = tripRepo.findAll();
        return trips;
    }

    @Override
    public List<Trip> getPlannedTrips() {
        List<Trip> trips = tripRepo.findByStatus(TripStatus.PLANNED);
        return trips;
    }

    @Override
    public List<Trip> getDepartedTrips() {
        List<Trip> trips = tripRepo.findByStatus(TripStatus.DEPARTED);
        return trips;
    }

    @Override
    public List<Trip> getArrivedTrips() {
        List<Trip> trips = tripRepo.findByStatus(TripStatus.ARRIVED);
        return trips;
    }

    @Override
    public List<Trip> getTodaysTrips() {
        LocalDate today = LocalDate.now();
        List<Trip> trips = tripRepo.findByStartDate(today);
        return trips;
    }

    @Override
    public Trip getById(Long id) {
        Optional<Trip> trip = tripRepo.findById(id);
        if (trip.isEmpty()) {
            throw new NoSuchElementException("Trip with id " + id + " does not exist");
        }

        return trip.get();
    }

    @Override
    public Trip save(TripInsertDTO trip) {
        Optional<Truck> truck = truckRepo.findById(trip.getTruckId());
        if (truck.isEmpty()) {
            throw new NoSuchElementException("Truck with plate number " + trip.getTruckId() + " does not exist");
        }
        Optional<Hub> startHub = hubRepo.findById(trip.getStartHubId());
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + trip.getStartHubId() + " does not exist");
        }
        Optional<Hub> endHub = hubRepo.findById(trip.getEndHubId());
        if (endHub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + trip.getEndHubId() + " does not exist");
        }

        List<Order> orders = new ArrayList<>();
        for (Long orderId : trip.getOrderIds()) {
            log.debug("Order ", orderId);
            Optional<Order> order = orderRepo.findById(orderId);
            if (order.isEmpty()) {
                throw new NoSuchElementException("Order with id " + orderId + " does not exist");
            }
            orders.add(order.get());
        }
        LocalTime startTime = LocalTime.parse(trip.getStartTime());
        LocalDate starDate = LocalDate.parse(trip.getStartDate());

        Trip newTrip = Trip.builder()
            .startHub(startHub.get())
            .endHub(endHub.get())
            .startDate(starDate)
            .startTime(startTime)
            .truck(truck.get())
            .orders(orders)
            .status(TripStatus.PLANNED)
            .type(trip.getType())
            .build();

        newTrip = tripRepo.save(newTrip);
        if (newTrip.getId() != null) {
            LocalDate today = LocalDate.now();
            Optional<DailyStatistics> todaysStats = dailyStatisticsRepo.findById(today);
            if (todaysStats.isEmpty()) {
                DailyStatistics newTodaysStats = DailyStatistics
                    .builder()
                    .date(today)
                    .tripsMade(1)
                    .build();
                newTodaysStats = dailyStatisticsRepo.save(newTodaysStats);
            } else {
                DailyStatistics stats = todaysStats.get();
                stats.setTripsMade(stats.getTripsMade() + 1);
                stats = dailyStatisticsRepo.save(stats);
            }
        }
        
        return newTrip;
    }

    @Override
    public Trip update(Long id, TripInsertDTO tripUpdate) {
        Optional<Trip> trip = tripRepo.findById(id);
        if (trip.isEmpty()) {
            throw new NoSuchElementException("Trip with id " + id + " does not exist");
        }

        Optional<Hub> startHub = hubRepo.findById(tripUpdate.getStartHubId());
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + tripUpdate.getStartHubId() + " does not exist");
        }
        Optional<Hub> endHub = hubRepo.findById(tripUpdate.getEndHubId());
        if (endHub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + tripUpdate.getEndHubId() + " does not exist");
        }
        Optional<Truck> truck = truckRepo.findById(tripUpdate.getTruckId());
        if (truck.isEmpty()) {
            throw new NoSuchElementException("Truck with plate number " + tripUpdate.getTruckId() + " does not exist");
        }

        List<Order> newOrders = new ArrayList<>();
        for (Long orderId : tripUpdate.getOrderIds()) {
            Optional<Order> order = orderRepo.findById(orderId);
            if (order.isEmpty()) {
                throw new NoSuchElementException("Order with id " + orderId + " does not exist");
            }
            newOrders.add(order.get());
        }
        LocalTime startTime = LocalTime.parse(tripUpdate.getStartTime());
        LocalDate starDate = LocalDate.parse(tripUpdate.getStartDate());

        Trip tripData = trip.get();
        tripData.setStartHub(startHub.get());
        tripData.setEndHub(endHub.get());
        tripData.setOrders(newOrders);
        tripData.setStartDate(starDate);
        tripData.setStartTime(startTime);
        tripData.setStatus(tripUpdate.getStatus());
        tripData.setTruck(truck.get());
        tripData.setType(tripUpdate.getType());

        return tripRepo.save(tripData);
    }

    @Override
    public Trip depart(Long id) {
        Optional<Trip> trip = tripRepo.findById(id);
        if (trip.isEmpty()) {
            throw new NoSuchElementException("Trip with id " + id + " does not exist");
        }

        Trip tripData = trip.get();
        for (Order order : tripData.getOrders()) {
            switch (tripData.getType()) {
                case LOCAL_TO_REGIONAL:
                    order.setStatus(OrderStatus.TRANSPORTING_TO_START_REGIONAL_HUB);
                    break;

                case REGIONAL_TO_REGIONAL:
                    order.setStatus(OrderStatus.TRANSPORTING_TO_END_REGIONAL_HUB);
                    break;

                case REGIONAL_TO_LOCAL:
                    order.setStatus(OrderStatus.TRANSPORTING_TO_END_LOCAL_HUB);
                    break;
            
                default:
                    break;
            }
            order = orderRepo.save(order);
        }
        tripData.setStatus(TripStatus.DEPARTED);
        
        return tripRepo.save(tripData);
    }

    @Override
    public Trip arrive(Long id) {
        Optional<Trip> trip = tripRepo.findById(id);
        if (trip.isEmpty()) {
            throw new NoSuchElementException("Trip with id " + id + " does not exist");
        }

        LocalDate today = LocalDate.now();
        Optional<DailyStatistics> todaysStats = dailyStatisticsRepo.findById(today);
        DailyStatistics stats = null;
        if (todaysStats.isEmpty()) {
            stats = DailyStatistics
                .builder()
                .date(today)
                .ordersMade(0)
                .ordersFinished(0)
                .tripsMade(0)
                .tripsFinished(1)
                .build();
        } else {
            stats = todaysStats.get();
            stats.setTripsFinished(stats.getTripsFinished() + 1);
        }

        Trip tripData = trip.get();
        int currentFinishedOrders = stats.getOrdersFinished();
        for (Order order : tripData.getOrders()) {
            switch (tripData.getType()) {
                case LOCAL_TO_REGIONAL:
                    if (order.getStartHub().getRegionalHub().equals(order.getEndHub().getRegionalHub())) {
                        order.setStatus(OrderStatus.AT_END_REGIONAL_HUB);
                    } else {
                        order.setStatus(OrderStatus.AT_START_REGIONAL_HUB);
                    }
                    break;

                case REGIONAL_TO_REGIONAL:
                    order.setStatus(OrderStatus.AT_END_REGIONAL_HUB);
                    break;

                case REGIONAL_TO_LOCAL:
                    order.setStatus(OrderStatus.AT_END_LOCAL_HUB);
                    currentFinishedOrders++;
                    break;
            
                default:
                    break;
            }
            order = orderRepo.save(order);
        }
        tripData.setStatus(TripStatus.ARRIVED);
        tripData = tripRepo.save(tripData);

        stats.setOrdersFinished(currentFinishedOrders);
        stats = dailyStatisticsRepo.save(stats);
        
        return tripData;
    }

    @Override
    public Trip cancel(Long id) {
        Optional<Trip> trip = tripRepo.findById(id);
        if (trip.isEmpty()) {
            throw new NoSuchElementException("Trip with id " + id + " does not exist");
        }

        Trip tripData = trip.get();
        tripData.setStatus(TripStatus.CANCELED);
        for (Order order : tripData.getOrders()) {
            switch (tripData.getType()) {
                case LOCAL_TO_REGIONAL:
                    order.setStatus(OrderStatus.AT_START_LOCAL_HUB);
                    break;

                case REGIONAL_TO_REGIONAL:
                    order.setStatus(OrderStatus.AT_START_REGIONAL_HUB);
                    break;

                case REGIONAL_TO_LOCAL:
                    order.setStatus(OrderStatus.AT_END_REGIONAL_HUB);
                    break;
            
                default:
                    break;
            }
            order = orderRepo.save(order);
        }
        tripData.getOrders().clear();

        return tripRepo.save(tripData);
    }
}
