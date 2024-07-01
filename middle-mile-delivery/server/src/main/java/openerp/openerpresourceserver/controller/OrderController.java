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
import openerp.openerpresourceserver.dto.OrderInsertDTO;
import openerp.openerpresourceserver.entity.Order;
import openerp.openerpresourceserver.service.order.OrderService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/order")
public class OrderController {
    
    private OrderService orderService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/get-at-start-local-hub/{startLocalHubId}")
    public ResponseEntity<?> getOrdersAtStartLocalHub(@PathVariable Long startLocalHubId) {
        List<Order> orders = orderService.getOrdersAtStartLocalHub(startLocalHubId);
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/get-at-start-regional-hub/{startRegionalHubId}/{endRegionalHubId}")
    public ResponseEntity<?> getOrdersAtStartRegionalHub(
            @PathVariable("startRegionalHubId") Long startRegionalHubId,
            @PathVariable("endRegionalHubId") Long endRegionalHubId) {
        List<Order> orders = orderService.getOrdersAtStartRegionalHub(startRegionalHubId, endRegionalHubId);
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/get-at-end-regional-hub/{endLocalHubId}")
    public ResponseEntity<?> getOrdersAtEndRegionalHub(@PathVariable Long endLocalHubId) {
        List<Order> orders = orderService.getOrdersAtEndRegionalHub(endLocalHubId);
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/get-by-route/{routeId}")
    public ResponseEntity<?> getOrdersByRoute(@PathVariable Long routeId) {
        List<Order> orders = orderService.getByRoute(routeId);
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Order order = orderService.getById(id);
        return ResponseEntity.ok().body(order);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderInsertDTO order) {
        Order savedOrder = orderService.create(order);
        return ResponseEntity.ok().body(savedOrder);
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> editOrder(@PathVariable Long id, @Valid @RequestBody OrderInsertDTO orderUpdate) {
        Order savedOrder = null;
        try {
            savedOrder = orderService.update(id, orderUpdate);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedOrder);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        orderService.remove(id);
        return ResponseEntity.ok().body(null);
    }
}
