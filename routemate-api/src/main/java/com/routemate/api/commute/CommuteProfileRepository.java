package com.routemate.api.commute;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommuteProfileRepository extends JpaRepository<CommuteProfile, UUID> {

    Optional<CommuteProfile> findByUserId(UUID userId);
}
