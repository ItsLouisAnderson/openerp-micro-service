package openerp.openerpresourceserver.repo.hub;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.hub.Hub;

@Repository
public interface HubRepo extends JpaRepository<Hub, Long> {
    
}
