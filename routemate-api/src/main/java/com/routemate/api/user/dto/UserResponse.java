package com.routemate.api.user.dto;

import com.routemate.api.commute.dto.CommuteResponse;
import com.routemate.api.user.Gender;
import com.routemate.api.user.User;
import com.routemate.api.user.VerificationStatus;
import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String name,
        String college,
        String branch,
        String year,
        Gender gender,
        VerificationStatus verificationStatus,
        Instant createdAt,
        CommuteResponse commute) {

    public static UserResponse of(User user, CommuteResponse commute) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCollege(),
                user.getBranch(),
                user.getYear(),
                user.getGender(),
                user.getVerificationStatus(),
                user.getCreatedAt(),
                commute);
    }
}
