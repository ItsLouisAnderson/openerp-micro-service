package openerp.openerpresourceserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.dto.StatisticsDTO;
import openerp.openerpresourceserver.service.statistics.StatisticsService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/statistics")
public class StatisticsController {
    
    private StatisticsService statisticsService;

    @GetMapping("/today")
    public ResponseEntity<?> getTodaysStats() {
        StatisticsDTO stats = statisticsService.getTodaysStatistics();
        return ResponseEntity.ok().body(stats);
    }
}
