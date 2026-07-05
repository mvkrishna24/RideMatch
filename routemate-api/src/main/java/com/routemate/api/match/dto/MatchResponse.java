package com.routemate.api.match.dto;

import com.routemate.api.user.Gender;
import java.util.UUID;

public record MatchResponse(
        UUID userId,
        String name,
        String branch,
        String year,
        Gender gender,
        String fromArea,
        String vehicleType,
        String morningTime,
        String activeDays,
        int matchScore,
        /** PENDING if I already sent this student an interest. */
        String outgoingInterestStatus,
        /** Set when this student has a pending interest waiting for me. */
        UUID incomingInterestId) {}
