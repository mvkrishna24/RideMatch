package com.routemate.api.match;

import com.routemate.api.auth.CurrentUser;
import com.routemate.api.match.dto.MatchResponse;
import com.routemate.api.user.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public List<MatchResponse> matches(@CurrentUser User user) {
        return matchService.matchesFor(user);
    }
}
