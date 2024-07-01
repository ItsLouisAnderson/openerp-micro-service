package openerp.openerpresourceserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.Order;
import openerp.openerpresourceserver.entity.Trip;

import java.util.List;
import openerp.openerpresourceserver.utils.OrderStatus;
import openerp.openerpresourceserver.entity.hub.LocalHub;



@Repository
public interface OrderRepo extends JpaRepository<Order, Long>{
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByStartHub(LocalHub startHub);

    List<Order> findByStartHubAndStatus(LocalHub startHub, OrderStatus status);

    List<Order> findByEndHubAndStatus(LocalHub endHub, OrderStatus status);

    @Query(value = "(SELECT o.* FROM mmd_order o LEFT JOIN mmd_hub h ON o.start_hub_id = h.id WHERE h.regional_hub_id = ?1 AND o.status = 'AT_START_REGIONAL_HUB') INTERSECT " +
        "(SELECT o.* FROM mmd_order o LEFT JOIN mmd_hub h ON o.end_hub_id = h.id WHERE h.regional_hub_id = ?2 AND o.status = 'AT_START_REGIONAL_HUB')", 
        nativeQuery = true)
    List<Order> findByStartRegionalHubAndEndRegionalHub(Long startRegionalHubId, Long endRegionalHubId);

    @Query(value = "SELECT COUNT(o.*) FROM mmd_order o WHERE o.status = :#{#status?.getCode()}", nativeQuery = true)
    int findCountByStatus(@Param("status") OrderStatus status);

    @Query(value = "SELECT count(o.*) FROM mmd_order o WHERE o.status LIKE 'TRANSPORTING%'", nativeQuery = true)
    int findCountTransporting();

}
