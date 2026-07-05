package com.routemate.api.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class UserServiceTest {

    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserService(userRepository);
    }

    @Test
    void returnsExistingUserWithoutCreating() {
        var existing = User.builder().firebaseUid("uid-1").email("a@jntuh.ac.in").build();
        when(userRepository.findByFirebaseUid("uid-1")).thenReturn(Optional.of(existing));

        var result = userService.findOrCreateByFirebaseUid("uid-1", "a@jntuh.ac.in");

        assertThat(result).isSameAs(existing);
        verify(userRepository, never()).save(any());
    }

    @Test
    void createsPendingUserOnFirstSight() {
        when(userRepository.findByFirebaseUid("uid-new")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = userService.findOrCreateByFirebaseUid("uid-new", "new@jntuh.ac.in");

        var captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getFirebaseUid()).isEqualTo("uid-new");
        assertThat(captor.getValue().getEmail()).isEqualTo("new@jntuh.ac.in");
        assertThat(result.getVerificationStatus()).isEqualTo(VerificationStatus.PENDING);
    }
}
