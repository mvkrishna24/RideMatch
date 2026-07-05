package com.routemate.api.user;

import com.routemate.api.user.dto.UpdateMeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * The auth filter calls this on every verified request. New Firebase
     * accounts get a local PENDING user row; existing ones are returned as-is.
     */
    @Transactional
    public User findOrCreateByFirebaseUid(String firebaseUid, String email) {
        return userRepository
                .findByFirebaseUid(firebaseUid)
                .orElseGet(() -> createUser(firebaseUid, email));
    }

    private User createUser(String firebaseUid, String email) {
        try {
            return userRepository.save(
                    User.builder().firebaseUid(firebaseUid).email(email).build());
        } catch (DataIntegrityViolationException e) {
            // Two first requests raced on the unique firebase_uid constraint;
            // the row exists now, so read it.
            return userRepository
                    .findByFirebaseUid(firebaseUid)
                    .orElseThrow(() -> e);
        }
    }

    @Transactional
    public User updateMe(User user, UpdateMeRequest request) {
        user.setName(request.name());
        user.setCollege(request.college());
        user.setBranch(request.branch());
        user.setYear(request.year());
        user.setGender(request.gender());
        return userRepository.save(user);
    }
}
