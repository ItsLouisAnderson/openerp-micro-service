package openerp.openerpresourceserver.repo.hub;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.hub.LocalHub;
import openerp.openerpresourceserver.entity.hub.RegionalHub;

@Repository
public interface LocalHubRepo extends JpaRepository<LocalHub, Long> {
    
    List<LocalHub> findByRegionalHub(RegionalHub regionalHub);

}
