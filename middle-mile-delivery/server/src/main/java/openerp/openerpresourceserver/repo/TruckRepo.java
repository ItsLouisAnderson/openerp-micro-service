package openerp.openerpresourceserver.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import openerp.openerpresourceserver.entity.Truck;
import openerp.openerpresourceserver.entity.hub.Hub;
import openerp.openerpresourceserver.entity.hub.RegionalHub;


@Repository
public interface TruckRepo extends JpaRepository<Truck, String>{
    
    List<Truck> findByHub(Hub hub);
    
}
