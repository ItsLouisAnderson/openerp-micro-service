package openerp.openerpresourceserver.service.hub;

import java.util.List;

import openerp.openerpresourceserver.dto.LocalHubInsertDTO;
import openerp.openerpresourceserver.entity.hub.LocalHub;

public interface LocalHubService {
    
    List<LocalHub> getAllLocalHubs();

    List<LocalHub> getByRegionalHubId(Long regionalHubId);

    LocalHub getById(Long id);
    
    LocalHub save(LocalHubInsertDTO hub);

    LocalHub update(Long id, LocalHubInsertDTO hubUpdate);

    void remove(Long id);
}
