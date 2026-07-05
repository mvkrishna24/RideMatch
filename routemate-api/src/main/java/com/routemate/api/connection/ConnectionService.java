package com.routemate.api.connection;

import com.routemate.api.common.UserSummary;
import com.routemate.api.commute.CommuteProfileRepository;
import com.routemate.api.connection.dto.ConnectionResponse;
import com.routemate.api.user.User;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final CommuteProfileRepository commuteProfileRepository;

    /** Pair is stored in UUID order so (A,B) and (B,A) are the same row. */
    @Transactional
    public Connection connect(User first, User second) {
        User a = first.getId().compareTo(second.getId()) < 0 ? first : second;
        User b = a == first ? second : first;
        if (connectionRepository.existsByUserAIdAndUserBId(a.getId(), b.getId())) {
            return connectionRepository
                    .findByUserAIdOrUserBIdOrderByCreatedAtDesc(a.getId(), a.getId())
                    .stream()
                    .filter(c -> involves(c, b.getId()))
                    .findFirst()
                    .orElseThrow();
        }
        return connectionRepository.save(Connection.builder().userA(a).userB(b).build());
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> listFor(User me) {
        return connectionRepository
                .findByUserAIdOrUserBIdOrderByCreatedAtDesc(me.getId(), me.getId())
                .stream()
                .map(connection -> toResponse(connection, me))
                .toList();
    }

    @Transactional(readOnly = true)
    public Set<UUID> connectedUserIds(UUID meId) {
        return connectionRepository.findByUserAIdOrUserBIdOrderByCreatedAtDesc(meId, meId).stream()
                .map(c -> c.getUserA().getId().equals(meId) ? c.getUserB().getId() : c.getUserA().getId())
                .collect(Collectors.toSet());
    }

    private ConnectionResponse toResponse(Connection connection, User me) {
        User other =
                connection.getUserA().getId().equals(me.getId())
                        ? connection.getUserB()
                        : connection.getUserA();
        var commute = commuteProfileRepository.findByUserId(other.getId()).orElse(null);
        return new ConnectionResponse(
                connection.getId(), connection.getCreatedAt(), UserSummary.of(other, commute));
    }

    private boolean involves(Connection connection, UUID userId) {
        return connection.getUserA().getId().equals(userId)
                || connection.getUserB().getId().equals(userId);
    }
}
