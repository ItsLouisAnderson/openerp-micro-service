package openerp.openerpresourceserver.service.hub;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.entity.hub.RegionalHub;
import openerp.openerpresourceserver.repo.hub.RegionalHubRepo;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class RegionalHubServiceImpl implements RegionalHubService {
    
    private RegionalHubRepo regionalHubRepo;
    
    @Override
    public List<RegionalHub> getAllRegionalHubs() {
        List<RegionalHub> hubs = regionalHubRepo.findAll();
        return hubs;
    }

    @Override
    public RegionalHub getById(Long id) {
        Optional<RegionalHub> hub = regionalHubRepo.findById(id);

        if (hub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + id + " does not exist");
        }
        return hub.get();
    }

    @Override
    public RegionalHub save(RegionalHub hub) {
        return regionalHubRepo.save(hub);
    }

    @Override
    public RegionalHub update(Long id, RegionalHub hubUpdate) {
        Optional<RegionalHub> hub = regionalHubRepo.findById(id);
        if (hub.isEmpty()) {
            throw new NoSuchElementException("Hub with id " + id + " does not exist");
        }

        RegionalHub hubData = hub.get();
        hubData.setName(hubUpdate.getName());
        hubData.setLat(hubUpdate.getLat());
        hubData.setLon(hubUpdate.getLon());

        return regionalHubRepo.save(hubData);
    }

    @Override
    public void remove(Long id) {
        regionalHubRepo.deleteById(id);
    }
}
