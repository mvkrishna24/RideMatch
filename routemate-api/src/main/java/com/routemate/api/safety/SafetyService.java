package com.routemate.api.safety;

import com.routemate.api.common.ConflictException;
import com.routemate.api.common.NotFoundException;
import com.routemate.api.connection.ConnectionRepository;
import com.routemate.api.interest.InterestRepository;
import com.routemate.api.user.User;
import com.routemate.api.user.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SafetyService {

    private final BlockRepository blockRepository;
    private final ReportRepository reportRepository;
    private final ConnectionRepository connectionRepository;
    private final InterestRepository interestRepository;
    private final UserRepository userRepository;

    /**
     * Blocking is total and immediate: the connection is severed, pending
     * interests disappear, and matching already excludes blocked pairs in
     * both directions. The blocked user is never notified.
     */
    @Transactional
    public void block(User me, UUID targetId) {
        requireOtherUser(me, targetId);
        blockRepository.save(
                Block.builder().blockerId(me.getId()).blockedUserId(targetId).build());

        UUID a = me.getId().compareTo(targetId) < 0 ? me.getId() : targetId;
        UUID b = a.equals(me.getId()) ? targetId : me.getId();
        connectionRepository
                .findByUserAIdAndUserBId(a, b)
                .ifPresent(connectionRepository::delete);

        interestRepository.deleteBySenderIdAndReceiverId(me.getId(), targetId);
        interestRepository.deleteBySenderIdAndReceiverId(targetId, me.getId());
    }

    @Transactional
    public void report(User me, UUID targetId, String reason) {
        requireOtherUser(me, targetId);
        reportRepository.save(
                Report.builder()
                        .reporterId(me.getId())
                        .reportedUserId(targetId)
                        .reason(reason)
                        .build());
        // Founder reviews reports directly in the database during MVP;
        // two reports on one user is the agreed suspension threshold.
        log.warn("User {} reported by {}: {}", targetId, me.getId(), reason);
    }

    private void requireOtherUser(User me, UUID targetId) {
        if (me.getId().equals(targetId)) {
            throw new ConflictException("You cannot do this to your own account");
        }
        if (!userRepository.existsById(targetId)) {
            throw new NotFoundException("Student not found");
        }
    }
}
