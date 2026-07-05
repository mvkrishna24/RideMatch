package com.routemate.api.match;

import com.routemate.api.commute.CommuteProfile;
import com.routemate.api.commute.VehicleType;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * The Phase 0 spreadsheet rubric, in code. 100 points total:
 * area 40 / timing 30 / vehicle fit 15 / shared days 15.
 * College sameness and gender preference are hard filters upstream, not scores.
 */
@Component
public class MatchScorer {

    /** Hyderabad corridor groups: same corridor = plausible shared route. */
    private static final List<Set<String>> CORRIDORS =
            List.of(
                    Set.of("Kukatpally", "KPHB", "Miyapur", "Nizampet", "Bachupally", "JNTU"),
                    Set.of("Kondapur", "Gachibowli", "Madhapur"),
                    Set.of("Ameerpet", "Secunderabad"),
                    Set.of("ECIL", "Uppal"),
                    Set.of("LB Nagar", "Dilsukhnagar"));

    private static final List<String> MORNING_SLOTS =
            List.of("before-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00");

    private static final Map<String, Integer> SLOT_INDEX =
            MORNING_SLOTS.stream()
                    .collect(Collectors.toMap(s -> s, MORNING_SLOTS::indexOf));

    public int score(CommuteProfile mine, CommuteProfile theirs) {
        return areaScore(mine.getFromArea(), theirs.getFromArea())
                + timingScore(mine.getMorningTime(), theirs.getMorningTime())
                + vehicleScore(mine.getVehicleType(), theirs.getVehicleType())
                + daysScore(mine.getActiveDays(), theirs.getActiveDays());
    }

    int areaScore(String mine, String theirs) {
        if (mine == null || theirs == null) {
            return 0;
        }
        if (mine.equalsIgnoreCase(theirs)) {
            return 40;
        }
        return sameCorridor(mine, theirs) ? 25 : 0;
    }

    int timingScore(String mine, String theirs) {
        Integer a = SLOT_INDEX.get(mine);
        Integer b = SLOT_INDEX.get(theirs);
        if (a == null || b == null) {
            return 0; // "Varies daily" or unknown slots can't be matched on time.
        }
        int gap = Math.abs(a - b);
        if (gap == 0) {
            return 30;
        }
        return gap == 1 ? 15 : 0;
    }

    int vehicleScore(VehicleType mine, VehicleType theirs) {
        boolean iOwn = mine != VehicleType.NONE;
        boolean theyOwn = theirs != VehicleType.NONE;
        if (iOwn != theyOwn) {
            return 15; // owner + rider — the pair the product exists for
        }
        return iOwn ? 5 : 10; // both owners weak; both riders can split an auto
    }

    int daysScore(String mine, String theirs) {
        Set<String> shared = csvToSet(mine);
        shared.retainAll(csvToSet(theirs));
        if (shared.size() >= 3) {
            return 15;
        }
        return shared.isEmpty() ? 0 : 8;
    }

    private boolean sameCorridor(String a, String b) {
        return CORRIDORS.stream()
                .anyMatch(corridor -> corridor.contains(a) && corridor.contains(b));
    }

    private Set<String> csvToSet(String csv) {
        if (csv == null || csv.isBlank()) {
            return new HashSet<>();
        }
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toCollection(HashSet::new));
    }
}
