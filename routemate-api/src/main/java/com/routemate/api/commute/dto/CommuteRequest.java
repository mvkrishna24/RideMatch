package com.routemate.api.commute.dto;

import com.routemate.api.commute.GenderPreference;
import com.routemate.api.commute.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CommuteRequest(
        @NotBlank @Size(max = 60) String fromArea,
        @Size(max = 120) String landmark,
        @NotBlank @Size(max = 120) String collegeDestination,
        @NotBlank @Size(max = 20) String morningTime,
        @NotBlank @Size(max = 20) String returnTime,
        @Size(max = 30) String activeDays,
        @NotNull VehicleType vehicleType,
        @NotNull GenderPreference genderPreference,
        @NotBlank
                @Pattern(
                        regexp = "^(\\+?91|0)?[6-9]\\d{9}$",
                        message = "must be a valid Indian mobile number")
                String emergencyContact) {}
