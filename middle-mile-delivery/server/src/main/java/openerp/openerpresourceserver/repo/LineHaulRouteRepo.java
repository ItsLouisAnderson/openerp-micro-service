package openerp.openerpresourceserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.LineHaulRoute;
import java.util.List;
import openerp.openerpresourceserver.entity.hub.RegionalHub;


@Repository
public interface LineHaulRouteRepo extends JpaRepository<LineHaulRoute, Long>{
    
    List<LineHaulRoute> findByStartHub(RegionalHub startHub);
}
