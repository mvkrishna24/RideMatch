package com.routemate.api.safety;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "reports")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Report {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "reporter_id", nullable = false, updatable = false)
    private UUID reporterId;

    @Column(name = "reported_user_id", nullable = false, updatable = false)
    private UUID reportedUserId;

    @Column(nullable = false, updatable = false)
    private String reason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
