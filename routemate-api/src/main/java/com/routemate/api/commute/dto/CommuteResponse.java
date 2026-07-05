package com.routemate.api.commute.dto;

import com.routemate.api.commute.CommuteProfile;
import com.routemate.api.commute.GenderPreference;
import com.routemate.api.commute.VehicleType;
import java.util.UUID;

public record CommuteResponse(
        UUID id,
        String fromArea,
        String landmark,
        String collegeDestination,
        String morningTime,
        String returnTime,
        String activeDays,
        VehicleType vehicleType,
        GenderPreference genderPreference,
        String emergencyContact) {

    public static CommuteResponse of(CommuteProfile profile) {
        return new CommuteResponse(
                profile.getId(),
                profile.getFromArea(),
                profile.getLandmark(),
                profile.getCollegeDestination(),
                profile.getMorningTime(),
                profile.getReturnTime(),
                profile.getActiveDays(),
                profile.getVehicleType(),
                profile.getGenderPreference(),
                profile.getEmergencyContact());
    }
}
