package openerp.openerpresourceserver.service.order;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.OrderInsertDTO;
import openerp.openerpresourceserver.entity.Order;
import openerp.openerpresourceserver.entity.DailyStatistics;
import openerp.openerpresourceserver.entity.LineHaulRoute;
import openerp.openerpresourceserver.entity.hub.LocalHub;
import openerp.openerpresourceserver.entity.hub.RegionalHub;
import openerp.openerpresourceserver.repo.OrderRepo;
import openerp.openerpresourceserver.repo.DailyStatisticsRepo;
import openerp.openerpresourceserver.repo.LineHaulRouteRepo;
import openerp.openerpresourceserver.repo.hub.LocalHubRepo;
import openerp.openerpresourceserver.repo.hub.RegionalHubRepo;
import openerp.openerpresourceserver.utils.OrderStatus;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class OrderServiceImpl implements OrderService {
    
    private OrderRepo orderRepo;

    private LocalHubRepo localHubRepo;

    private RegionalHubRepo regionalHubRepo;

    private LineHaulRouteRepo routeRepo;

    private DailyStatisticsRepo dailyStatisticsRepo;

    @Override
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepo.findAll();
        return orders;
    }

    @Override
    public List<Order> getOrdersAtStartLocalHub(Long startLocalHubId) {
        Optional<LocalHub> startHub = localHubRepo.findById(startLocalHubId);
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Local hub with id " + startLocalHubId + " does not exist");
        }

        return orderRepo.findByStartHubAndStatus(startHub.get(), OrderStatus.AT_START_LOCAL_HUB);
    }

    @Override
    public List<Order> getOrdersAtStartRegionalHub(Long startRegionalHubId, Long endRegionalHubId) {
        Optional<RegionalHub> startRegionalHub = regionalHubRepo.findById(startRegionalHubId);
        if (startRegionalHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + startRegionalHubId + " does not exist");
        }
        Optional<RegionalHub> endRegionalHub = regionalHubRepo.findById(endRegionalHubId);
        if (endRegionalHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + endRegionalHubId + " does not exist");
        }
        return orderRepo.findByStartRegionalHubAndEndRegionalHub(startRegionalHubId, endRegionalHubId);
    }

    @Override
    public List<Order> getOrdersAtEndRegionalHub(Long endLocalHubId) {
        Optional<LocalHub> endHub = localHubRepo.findById(endLocalHubId);
        if (endHub.isEmpty()) {
            throw new NoSuchElementException("Local hub with id " + endLocalHubId + " does not exist");
        }

        return orderRepo.findByEndHubAndStatus(endHub.get(), OrderStatus.AT_END_REGIONAL_HUB);
    }

    @Override
    public List<Order> getByRoute(Long routeId) {
        Optional<LineHaulRoute> route = routeRepo.findById(routeId);
        if (route.isEmpty()) {
            throw new NoSuchElementException("Route with id " + routeId + " does not exist");
        }

        RegionalHub startRegionalHub = route.get().getStartHub();
        RegionalHub endRegionalHub = route.get().getEndHub();

        List<LocalHub> startLocalHubs = localHubRepo.findByRegionalHub(startRegionalHub);

        List<Order> result = new ArrayList<>();
        for (LocalHub startLocalHub : startLocalHubs) {
            List<Order> orders = orderRepo.findByStartHub(startLocalHub);
            result.addAll(orders);
        }

        result.removeIf(order -> !order.getEndHub().getRegionalHub().equals(endRegionalHub));

        return result;
    }

    @Override
    public Order getById(Long id) {
        Optional<Order> order = orderRepo.findById(id);
        if (order.isEmpty()) {
            throw new NoSuchElementException("Order with id + " + id + " does not exist");
        }
        return order.get();
    }

    @Override
    public Order create(OrderInsertDTO order) {
        Optional<LocalHub> startHub = localHubRepo.findById(order.getStartHubId());
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Local hub with id + " + order.getStartHubId() + " does not exist");
        }
        Optional<LocalHub> endHub = localHubRepo.findById(order.getEndHubId());
        if (endHub.isEmpty()) {
            throw new NoSuchElementException("Local hub with id + " + order.getEndHubId() + " does not exist");
        }

        Order newOrder = Order.builder()
            .description(order.getDescription())
            .startHub(startHub.get())
            .endHub(endHub.get())
            .weight(order.getWeight())
            .status(OrderStatus.AT_START_LOCAL_HUB)
            .build();

        newOrder = orderRepo.save(newOrder);
        if (newOrder.getId() != null) {
            LocalDate today = LocalDate.now();
            Optional<DailyStatistics> todaysStats = dailyStatisticsRepo.findById(today);
            if (todaysStats.isEmpty()) {
                DailyStatistics newTodaysStats = DailyStatistics
                    .builder()
                    .date(today)
                    .ordersMade(1)
                    .build();
                newTodaysStats = dailyStatisticsRepo.save(newTodaysStats);
            } else {
                DailyStatistics stats = todaysStats.get();
                stats.setOrdersMade(stats.getOrdersMade() + 1);
                stats = dailyStatisticsRepo.save(stats);
            }
        }

        return newOrder;
    }

    @Override
    public Order update(Long id, OrderInsertDTO orderUpdate) {
        Optional<Order> order = orderRepo.findById(id);
        if (order.isEmpty()) {
            throw new NoSuchElementException("Order with id + " + id + " does not exist");
        }

        Optional<LocalHub> startHub = localHubRepo.findById(orderUpdate.getStartHubId());
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Local hub with id + " + orderUpdate.getStartHubId() + " does not exist");
        }
        Optional<LocalHub> endHub = localHubRepo.findById(orderUpdate.getEndHubId());
        if (endHub.isEmpty()) {
            throw new NoSuchElementException("Local hub with id + " + orderUpdate.getEndHubId() + " does not exist");
        }

        Order orderData = order.get();
        orderData.setDescription(orderUpdate.getDescription());
        orderData.setStartHub(startHub.get());
        orderData.setEndHub(endHub.get());
        orderData.setWeight(orderUpdate.getWeight());
        orderData.setStatus(orderUpdate.getStatus());

        return orderRepo.save(orderData);
    }

    @Override
    public void remove(Long id) {
        Optional<Order> order = orderRepo.findById(id);
        if (order.isEmpty()) {
            throw new NoSuchElementException("Order with id + " + id + " does not exist");
        }
        orderRepo.delete(order.get());
    }
}
