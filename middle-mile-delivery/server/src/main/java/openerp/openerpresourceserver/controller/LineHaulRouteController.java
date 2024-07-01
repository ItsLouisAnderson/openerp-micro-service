package openerp.openerpresourceserver.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.dto.LineHaulRouteInsertDTO;
import openerp.openerpresourceserver.entity.LineHaulRoute;
import openerp.openerpresourceserver.service.route.LineHaulRouteService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/route")
public class LineHaulRouteController {
    
    private LineHaulRouteService routeService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllRoutes() {
        List<LineHaulRoute> routes = routeService.getAllRoutes();
        return ResponseEntity.ok().body(routes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRouteById(@PathVariable Long id) {
        LineHaulRoute route = routeService.getById(id);
        return ResponseEntity.ok().body(route);
    }

    @GetMapping("/get-by-start-hub/{hubId}")
    public ResponseEntity<?> getRouteByStartHubId(@PathVariable Long hubId) {
        List<LineHaulRoute> routes = routeService.getByStartHub(hubId);
        return ResponseEntity.ok().body(routes);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoute(@Valid @RequestBody LineHaulRouteInsertDTO route) {
        LineHaulRoute savedRoute = routeService.save(route);
        return ResponseEntity.ok().body(savedRoute);
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> editRoute(@PathVariable Long id, @Valid @RequestBody LineHaulRouteInsertDTO routeUpdate) {
        LineHaulRoute savedRoute = null;
        try {
            savedRoute = routeService.update(id, routeUpdate);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedRoute);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        routeService.remove(id);
        return ResponseEntity.ok().body(null);
    }
    
}
