package com.routemate.api.user;

import com.routemate.api.auth.CurrentUser;
import com.routemate.api.commute.CommuteService;
import com.routemate.api.commute.dto.CommuteResponse;
import com.routemate.api.user.dto.UpdateMeRequest;
import com.routemate.api.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CommuteService commuteService;

    @GetMapping
    public UserResponse me(@CurrentUser User user) {
        CommuteResponse commute =
                commuteService.findByUser(user).map(CommuteResponse::of).orElse(null);
        return UserResponse.of(user, commute);
    }

    @PutMapping
    public UserResponse updateMe(
            @CurrentUser User user, @Valid @RequestBody UpdateMeRequest request) {
        User updated = userService.updateMe(user, request);
        CommuteResponse commute =
                commuteService.findByUser(updated).map(CommuteResponse::of).orElse(null);
        return UserResponse.of(updated, commute);
    }
}
