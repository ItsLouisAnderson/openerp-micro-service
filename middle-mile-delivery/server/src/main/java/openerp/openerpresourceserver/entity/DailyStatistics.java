package openerp.openerpresourceserver.entity;

import java.time.LocalDate;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mmd_daily_statistics")
public class DailyStatistics {
    @Id
    @Column(name = "date", updatable = false, nullable = false)
    private LocalDate date;

    @Column(name = "orders_made")
    @ColumnDefault("0")
    private int ordersMade;

    @Column(name = "orders_finished")
    @ColumnDefault("0")
    private int ordersFinished;

    @Column(name = "trips_made")
    @ColumnDefault("0")
    private int tripsMade;

    @Column(name = "trips_finished")
    @ColumnDefault("0")
    private int tripsFinished;
}
