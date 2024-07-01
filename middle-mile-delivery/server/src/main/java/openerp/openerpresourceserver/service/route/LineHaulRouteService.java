package openerp.openerpresourceserver.service.route;

import java.util.List;

import openerp.openerpresourceserver.dto.LineHaulRouteInsertDTO;
import openerp.openerpresourceserver.entity.LineHaulRoute;

public interface LineHaulRouteService {
    
    List<LineHaulRoute> getAllRoutes();

    LineHaulRoute getById(Long id);

    List<LineHaulRoute> getByStartHub(Long startHubId);

    LineHaulRoute save(LineHaulRouteInsertDTO route);

    LineHaulRoute update(Long id, LineHaulRouteInsertDTO routeUpdate);

    void remove(Long id);
}
