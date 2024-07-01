package openerp.openerpresourceserver.repo.hub;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.hub.RegionalHub;

@Repository
public interface RegionalHubRepo extends JpaRepository<RegionalHub, Long> {
    
}
