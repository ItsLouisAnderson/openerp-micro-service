package openerp.openerpresourceserver.service.order;

import java.util.List;

import openerp.openerpresourceserver.dto.OrderInsertDTO;
import openerp.openerpresourceserver.entity.Order;

public interface OrderService {
    
    List<Order> getAllOrders();

    List<Order> getOrdersAtStartLocalHub(Long startLocalHubId);

    List<Order> getOrdersAtStartRegionalHub(Long startRegionalHubId, Long endRegionalHubId);

    List<Order> getOrdersAtEndRegionalHub(Long endLocalHubId);

    List<Order> getByRoute(Long routeId);

    Order getById(Long id);

    Order create(OrderInsertDTO order);

    Order update(Long id, OrderInsertDTO orderUpdate);

    void remove(Long id);

}
