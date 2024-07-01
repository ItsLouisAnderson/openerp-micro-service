package openerp.openerpresourceserver.service.route;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.LineHaulRouteInsertDTO;
import openerp.openerpresourceserver.entity.LineHaulRoute;
import openerp.openerpresourceserver.entity.hub.RegionalHub;
import openerp.openerpresourceserver.repo.LineHaulRouteRepo;
import openerp.openerpresourceserver.repo.hub.RegionalHubRepo;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class LineHaulRouteServiceImpl implements LineHaulRouteService {
    
    private LineHaulRouteRepo routeRepo;

    private RegionalHubRepo hubRepo;

    @Override
    public List<LineHaulRoute> getAllRoutes() {
        List<LineHaulRoute> routes = routeRepo.findAll();
        return routes;
    }

    @Override
    public LineHaulRoute getById(Long id) {
        Optional<LineHaulRoute> route = routeRepo.findById(id);

        if (route.isEmpty()) {
            throw new NoSuchElementException("Route with id " + id + " does not exist");
        }

        return route.get();
    }

    @Override
    public List<LineHaulRoute> getByStartHub(Long startHubId) {
        Optional<RegionalHub> startHub = hubRepo.findById(startHubId);
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + startHubId + " does not exist");
        }
        
        List<LineHaulRoute> routes = routeRepo.findByStartHub(startHub.get());

        return routes;
    }

    @Override
    public LineHaulRoute save(LineHaulRouteInsertDTO route) {
        Optional<RegionalHub> startHub = hubRepo.findById(route.getStartHubId());
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + route.getStartHubId() + " does not exist");
        }
        Optional<RegionalHub> endHub = hubRepo.findById(route.getEndHubId());
        if (endHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + route.getEndHubId() + " does not exist");
        }

        List<LocalTime> startTimes = new ArrayList<LocalTime>();
        for (String timeStr : route.getStartTimes()) {
            LocalTime time = LocalTime.parse(timeStr);
            startTimes.add(time);
        }

        LineHaulRoute newRoute = LineHaulRoute.builder()
            .name(route.getName())
            .startHub(startHub.get())
            .endHub(endHub.get())
            .startTimes(startTimes)
            .build();
        
        return routeRepo.save(newRoute);
    }

    @Override
    public LineHaulRoute update(Long id, LineHaulRouteInsertDTO routeUpdate) {
        Optional<LineHaulRoute> route = routeRepo.findById(id);
        if (route.isEmpty()) {
            throw new NoSuchElementException("Route with id " + id + " does not exist");
        }

        Optional<RegionalHub> startHub = hubRepo.findById(routeUpdate.getStartHubId());
        if (startHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + routeUpdate.getStartHubId() + " does not exist");
        }
        Optional<RegionalHub> endHub = hubRepo.findById(routeUpdate.getEndHubId());
        if (endHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + routeUpdate.getEndHubId() + " does not exist");
        }

        List<LocalTime> startTimes = new ArrayList<LocalTime>();
        for (String timeStr : routeUpdate.getStartTimes()) {
            LocalTime time = LocalTime.parse(timeStr);
            startTimes.add(time);
        }

        LineHaulRoute routeData = route.get();
        routeData.setName(routeUpdate.getName());
        routeData.setStartHub(startHub.get());
        routeData.setEndHub(endHub.get());
        routeData.setStartTimes(startTimes);

        return routeRepo.save(routeData);
    }

    @Override
    public void remove(Long id) {
        routeRepo.deleteById(id);
    }
}
