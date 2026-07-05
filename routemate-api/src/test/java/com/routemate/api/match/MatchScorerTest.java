package com.routemate.api.match;

import static org.assertj.core.api.Assertions.assertThat;

import com.routemate.api.commute.VehicleType;
import org.junit.jupiter.api.Test;

class MatchScorerTest {

    private final MatchScorer scorer = new MatchScorer();

    @Test
    void areaScoring() {
        assertThat(scorer.areaScore("Kukatpally", "Kukatpally")).isEqualTo(40);
        assertThat(scorer.areaScore("Kukatpally", "Miyapur")).isEqualTo(25); // same corridor
        assertThat(scorer.areaScore("Kukatpally", "LB Nagar")).isEqualTo(0);
        assertThat(scorer.areaScore("Gachibowli", "Madhapur")).isEqualTo(25);
    }

    @Test
    void timingScoring() {
        assertThat(scorer.timingScore("8:30-9:00", "8:30-9:00")).isEqualTo(30);
        assertThat(scorer.timingScore("8:30-9:00", "9:00-9:30")).isEqualTo(15); // adjacent
        assertThat(scorer.timingScore("before-8:30", "9:00-9:30")).isEqualTo(0);
        assertThat(scorer.timingScore("varies", "8:30-9:00")).isEqualTo(0);
    }

    @Test
    void vehicleScoring() {
        assertThat(scorer.vehicleScore(VehicleType.BIKE, VehicleType.NONE)).isEqualTo(15);
        assertThat(scorer.vehicleScore(VehicleType.NONE, VehicleType.SCOOTY)).isEqualTo(15);
        assertThat(scorer.vehicleScore(VehicleType.NONE, VehicleType.NONE)).isEqualTo(10);
        assertThat(scorer.vehicleScore(VehicleType.BIKE, VehicleType.CAR)).isEqualTo(5);
    }

    @Test
    void daysScoring() {
        assertThat(scorer.daysScore("M,T,W,Th,F", "M,T,W,Th,F")).isEqualTo(15);
        assertThat(scorer.daysScore("M,T,W", "W,Th,F")).isEqualTo(8); // one shared day
        assertThat(scorer.daysScore("M,T", "Th,F")).isEqualTo(0);
        assertThat(scorer.daysScore(null, "M,T")).isEqualTo(0);
    }

    @Test
    void perfectMatchIsExactlyHundred() {
        // same area 40 + same slot 30 + owner/rider 15 + shared week 15 = 100
        assertThat(
                        scorer.areaScore("Kukatpally", "Kukatpally")
                                + scorer.timingScore("8:30-9:00", "8:30-9:00")
                                + scorer.vehicleScore(VehicleType.BIKE, VehicleType.NONE)
                                + scorer.daysScore("M,T,W,Th,F", "M,T,W,Th,F"))
                .isEqualTo(100);
    }
}
