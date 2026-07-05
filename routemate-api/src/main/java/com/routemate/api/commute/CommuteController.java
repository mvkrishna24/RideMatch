package com.routemate.api.commute;

import com.routemate.api.auth.CurrentUser;
import com.routemate.api.commute.dto.CommuteRequest;
import com.routemate.api.commute.dto.CommuteResponse;
import com.routemate.api.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/commute")
@RequiredArgsConstructor
public class CommuteController {

    private final CommuteService commuteService;

    @PutMapping
    public CommuteResponse upsert(
            @CurrentUser User user, @Valid @RequestBody CommuteRequest request) {
        return CommuteResponse.of(commuteService.upsert(user, request));
    }
}
