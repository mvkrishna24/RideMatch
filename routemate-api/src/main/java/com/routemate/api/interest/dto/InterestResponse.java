package com.routemate.api.interest.dto;

import com.routemate.api.common.UserSummary;
import com.routemate.api.interest.InterestStatus;
import java.time.Instant;
import java.util.UUID;

public record InterestResponse(
        UUID id, InterestStatus status, Instant createdAt, UserSummary sender) {}
