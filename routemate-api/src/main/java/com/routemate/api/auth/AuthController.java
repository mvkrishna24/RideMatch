package com.routemate.api.auth;

import com.routemate.api.commute.CommuteService;
import com.routemate.api.commute.dto.CommuteResponse;
import com.routemate.api.user.User;
import com.routemate.api.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CommuteService commuteService;

    /**
     * First call after Firebase sign-in. The token filter has already
     * found-or-created the local user; this returns their current standing.
     */
    @PostMapping("/sync")
    public UserResponse sync(@CurrentUser User user) {
        CommuteResponse commute =
                commuteService.findByUser(user).map(CommuteResponse::of).orElse(null);
        return UserResponse.of(user, commute);
    }
}
