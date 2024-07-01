package openerp.openerpresourceserver.service.hub;

import java.util.List;

import openerp.openerpresourceserver.entity.hub.RegionalHub;

public interface RegionalHubService {
    
    List<RegionalHub> getAllRegionalHubs();

    RegionalHub getById(Long id);

    RegionalHub save(RegionalHub hub);

    RegionalHub update(Long id, RegionalHub hubUpdate);

    void remove(Long id);
}
