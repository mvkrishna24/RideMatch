package com.routemate.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.routemate.api.user.User;
import com.routemate.api.user.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Authenticates requests carrying "Authorization: Bearer <firebase id token>".
 * On success the local User (created on first sight) becomes the principal.
 * Requests without a header pass through anonymous — the security rules
 * decide what anonymous is allowed to reach (only /health).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final FirebaseTokenVerifier tokenVerifier;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().equals("/health");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = header.substring(BEARER_PREFIX.length()).trim();
        try {
            FirebaseTokenVerifier.DecodedToken decoded = tokenVerifier.verify(idToken);
            User user = userService.findOrCreateByFirebaseUid(decoded.uid(), decoded.email());

            var authentication =
                    new UsernamePasswordAuthenticationToken(
                            user, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception e) {
            log.debug("Firebase token rejected: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(
                    response.getWriter(), Map.of("error", "Invalid or expired credentials"));
            return;
        }

        filterChain.doFilter(request, response);
    }
}
