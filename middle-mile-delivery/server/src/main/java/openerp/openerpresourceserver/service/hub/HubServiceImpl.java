package openerp.openerpresourceserver.service.hub;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.entity.hub.Hub;
import openerp.openerpresourceserver.repo.hub.HubRepo;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class HubServiceImpl implements HubService {

    private HubRepo hubRepo;

    @Override
    public List<Hub> getAllHubs() {
        List<Hub> hubs = hubRepo.findAll();
        return hubs;
    }
}
