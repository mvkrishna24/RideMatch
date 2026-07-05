package com.routemate.api.connection;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectionRepository extends JpaRepository<Connection, UUID> {

    List<Connection> findByUserAIdOrUserBIdOrderByCreatedAtDesc(UUID userAId, UUID userBId);

    boolean existsByUserAIdAndUserBId(UUID userAId, UUID userBId);

    Optional<Connection> findByUserAIdAndUserBId(UUID userAId, UUID userBId);
}
