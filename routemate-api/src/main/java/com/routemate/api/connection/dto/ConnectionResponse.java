package com.routemate.api.connection.dto;

import com.routemate.api.common.UserSummary;
import java.time.Instant;
import java.util.UUID;

public record ConnectionResponse(
        UUID id,
        Instant createdAt,
        UserSummary user,
        /**
         * The partner's Firebase UID — only revealed after mutual consent
         * (a connection), never in the match feed. Chat rooms are keyed and
         * secured with it.
         */
        String partnerFirebaseUid) {}
