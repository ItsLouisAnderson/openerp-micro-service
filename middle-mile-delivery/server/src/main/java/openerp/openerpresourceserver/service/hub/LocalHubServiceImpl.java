package openerp.openerpresourceserver.service.hub;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.LocalHubInsertDTO;
import openerp.openerpresourceserver.entity.hub.LocalHub;
import openerp.openerpresourceserver.entity.hub.RegionalHub;
import openerp.openerpresourceserver.repo.hub.LocalHubRepo;
import openerp.openerpresourceserver.repo.hub.RegionalHubRepo;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class LocalHubServiceImpl implements LocalHubService {
    
    private LocalHubRepo localHubRepo;

    private RegionalHubRepo regionalHubRepo;

    @Override
    public List<LocalHub> getAllLocalHubs() {
        List<LocalHub> hubs = localHubRepo.findAll();
        return hubs;
    }

    @Override
    public List<LocalHub> getByRegionalHubId(Long regionalHubId) {
        Optional<RegionalHub> regionalHub = regionalHubRepo.findById(regionalHubId);
        if (regionalHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + regionalHubId + " does not exist");
        }
        
        return localHubRepo.findByRegionalHub(regionalHub.get());
    }

    @Override
    public LocalHub getById(Long id) {
        Optional<LocalHub> hub = localHubRepo.findById(id);

        if (hub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + id + " does not exist");
        }
        return hub.get();
    }

    @Override
    public LocalHub save(LocalHubInsertDTO hub) {
        Optional<RegionalHub> regionalHub = regionalHubRepo.findById(hub.getRegionalHubId());
        
        if (regionalHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + hub.getRegionalHubId() + " does not exist");
        }
        LocalHub newLocalHub = LocalHub.builder()
            .name(hub.getName())
            .lat(hub.getLat())
            .lon(hub.getLon())
            .regionalHub(regionalHub.get())
            .build();

        return localHubRepo.save(newLocalHub);
    }

    @Override
    public LocalHub update(Long id, LocalHubInsertDTO hubUpdate) {
        Optional<LocalHub> hub = localHubRepo.findById(id);
        if (hub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + id + " does not exist");
        }

        Optional<RegionalHub> newRegionalHub = regionalHubRepo.findById(hubUpdate.getRegionalHubId());
        if (newRegionalHub.isEmpty()) {
            throw new NoSuchElementException("Regional hub with id " + hubUpdate.getRegionalHubId() + " does not exist");
        }

        LocalHub hubData = hub.get();
        hubData.setName(hubUpdate.getName());
        hubData.setLat(hubUpdate.getLat());
        hubData.setLon(hubUpdate.getLon());
        hubData.setRegionalHub(newRegionalHub.get());

        return localHubRepo.save(hubData);
    }

    @Override
    public void remove(Long id) {
        localHubRepo.deleteById(id);
    }
}
