package com.routemate.api.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.routemate.api.user.User;
import com.routemate.api.user.UserService;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

class FirebaseTokenFilterTest {

    private FirebaseTokenVerifier verifier;
    private UserService userService;
    private FirebaseTokenFilter filter;

    @BeforeEach
    void setUp() {
        verifier = mock(FirebaseTokenVerifier.class);
        userService = mock(UserService.class);
        filter = new FirebaseTokenFilter(verifier, userService, new ObjectMapper());
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void validTokenAuthenticatesAndCreatesLocalUser() throws Exception {
        var request = new MockHttpServletRequest("GET", "/api/me");
        request.addHeader("Authorization", "Bearer valid-token");
        var response = new MockHttpServletResponse();
        var chain = mock(FilterChain.class);

        var user = User.builder().firebaseUid("uid-1").email("a@jntuh.ac.in").build();
        when(verifier.verify("valid-token"))
                .thenReturn(new FirebaseTokenVerifier.DecodedToken("uid-1", "a@jntuh.ac.in"));
        when(userService.findOrCreateByFirebaseUid("uid-1", "a@jntuh.ac.in")).thenReturn(user);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getPrincipal()).isSameAs(user);
    }

    @Test
    void invalidTokenReturns401AndStopsChain() throws Exception {
        var request = new MockHttpServletRequest("GET", "/api/me");
        request.addHeader("Authorization", "Bearer bad-token");
        var response = new MockHttpServletResponse();
        var chain = mock(FilterChain.class);

        when(verifier.verify("bad-token")).thenThrow(new IllegalArgumentException("expired"));

        filter.doFilter(request, response, chain);

        verify(chain, never()).doFilter(any(), any());
        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void missingHeaderPassesThroughAnonymous() throws Exception {
        var request = new MockHttpServletRequest("GET", "/api/me");
        var response = new MockHttpServletResponse();
        var chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }
}
