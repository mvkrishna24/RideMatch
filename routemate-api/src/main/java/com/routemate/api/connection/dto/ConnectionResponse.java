package com.routemate.api.connection.dto;

import com.routemate.api.common.UserSummary;
import java.time.Instant;
import java.util.UUID;

public record ConnectionResponse(UUID id, Instant createdAt, UserSummary user) {}
