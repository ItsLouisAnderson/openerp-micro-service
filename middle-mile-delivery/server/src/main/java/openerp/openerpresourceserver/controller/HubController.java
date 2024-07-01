package openerp.openerpresourceserver.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.dto.LocalHubInsertDTO;
import openerp.openerpresourceserver.entity.hub.Hub;
import openerp.openerpresourceserver.entity.hub.LocalHub;
import openerp.openerpresourceserver.entity.hub.RegionalHub;
import openerp.openerpresourceserver.service.hub.HubService;
import openerp.openerpresourceserver.service.hub.LocalHubService;
import openerp.openerpresourceserver.service.hub.RegionalHubService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/hub")
public class HubController {

    private HubService hubService;
    
    private RegionalHubService regionalHubService;

    private LocalHubService localHubService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllHubs() {
        List<Hub> hubs = hubService.getAllHubs();
        return ResponseEntity.ok().body(hubs);
    }

    @GetMapping("/regional")
    public ResponseEntity<?> getAllRegionalHubs() {
       List<RegionalHub> hubs = regionalHubService.getAllRegionalHubs();
       return ResponseEntity.ok().body(hubs);
    }

    @GetMapping("/regional/{id}")
    public ResponseEntity<?> getRegionalHubById(@PathVariable Long id) {
        RegionalHub hub = regionalHubService.getById(id);
        return ResponseEntity.ok().body(hub);
    }

    @PostMapping("/regional")
    public ResponseEntity<?> createRegionalHub(@Valid @RequestBody RegionalHub regionalHub) {
        RegionalHub savedHub = regionalHubService.save(regionalHub);
        return ResponseEntity.ok().body(savedHub);
    }

    @PostMapping("/regional/delete/{id}")
    public ResponseEntity<?> deleteRegionalHub(@PathVariable Long id) {
        regionalHubService.remove(id);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/regional/edit/{id}")
    public ResponseEntity<?> editRegionalHub(@PathVariable Long id, @Valid @RequestBody RegionalHub regionalHub) {
        RegionalHub savedHub = null;
        try {
            savedHub = regionalHubService.update(id, regionalHub);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedHub);
    }
    
    @GetMapping("/local")
    public ResponseEntity<?> getAllLocalHubs() {
       List<LocalHub> hubs = localHubService.getAllLocalHubs();
       return ResponseEntity.ok().body(hubs);
    }

    @GetMapping("/local/get-by-regional-hub/{regionalHubId}")
    public ResponseEntity<?> getLocalHubsByRegionalHubId(@PathVariable Long regionalHubId) {
        List<LocalHub> hubs = localHubService.getByRegionalHubId(regionalHubId);
        return ResponseEntity.ok().body(hubs);
    }
    
    @GetMapping("/local/{id}")
    public ResponseEntity<?> getLocalHubById(@PathVariable Long id) {
        LocalHub hub = localHubService.getById(id);
        return ResponseEntity.ok().body(hub);
    }
    
    @PostMapping("/local")
    public ResponseEntity<?> createLocalHub(@Valid @RequestBody LocalHubInsertDTO localHub) {
        LocalHub savedHub = localHubService.save(localHub);
        return ResponseEntity.ok().body(savedHub);
    }

    @PostMapping("/local/delete/{id}")
    public ResponseEntity<?> deleteLocalHub(@PathVariable Long id) {
        localHubService.remove(id);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/local/edit/{id}")
    public ResponseEntity<?> editLocalHub(@PathVariable Long id, @Valid @RequestBody LocalHubInsertDTO localHub) {
        LocalHub savedHub = null;
        try {
            savedHub = localHubService.update(id, localHub);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(savedHub);
    }
}
