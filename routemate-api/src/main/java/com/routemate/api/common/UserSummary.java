package com.routemate.api.common;

import com.routemate.api.commute.CommuteProfile;
import com.routemate.api.user.Gender;
import com.routemate.api.user.User;
import java.util.UUID;

/** The public face of a student: what other verified students may see. */
public record UserSummary(
        UUID userId,
        String name,
        String branch,
        String year,
        Gender gender,
        String fromArea,
        String vehicleType,
        String morningTime,
        String activeDays) {

    public static UserSummary of(User user, CommuteProfile commute) {
        return new UserSummary(
                user.getId(),
                user.getName(),
                user.getBranch(),
                user.getYear(),
                user.getGender(),
                commute != null ? commute.getFromArea() : null,
                commute != null ? commute.getVehicleType().name() : null,
                commute != null ? commute.getMorningTime() : null,
                commute != null ? commute.getActiveDays() : null);
    }
}
