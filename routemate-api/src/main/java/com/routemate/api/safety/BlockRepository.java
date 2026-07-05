package com.routemate.api.safety;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockRepository extends JpaRepository<Block, BlockId> {

    List<Block> findByBlockerIdOrBlockedUserId(UUID blockerId, UUID blockedUserId);
}
