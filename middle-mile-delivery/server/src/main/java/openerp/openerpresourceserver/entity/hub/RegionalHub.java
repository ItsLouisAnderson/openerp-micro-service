package openerp.openerpresourceserver.entity.hub;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import openerp.openerpresourceserver.entity.Truck;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("REGIONAL")
public class RegionalHub extends Hub {
    @OneToMany(
        mappedBy = "regionalHub",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    private List<LocalHub> localHubs = new ArrayList<>();
}
