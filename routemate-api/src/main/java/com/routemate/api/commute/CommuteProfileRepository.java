package com.routemate.api.commute;

import com.routemate.api.user.VerificationStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommuteProfileRepository extends JpaRepository<CommuteProfile, UUID> {

    Optional<CommuteProfile> findByUserId(UUID userId);

    @Query(
            "select c from CommuteProfile c join fetch c.user u "
                    + "where u.id <> :meId and u.verificationStatus = :status "
                    + "and c.collegeDestination = :college")
    List<CommuteProfile> findMatchCandidates(
            @Param("meId") UUID meId,
            @Param("status") VerificationStatus status,
            @Param("college") String college);
}
