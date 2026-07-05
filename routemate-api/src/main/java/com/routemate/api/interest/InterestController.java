package com.routemate.api.interest;

import com.routemate.api.auth.CurrentUser;
import com.routemate.api.interest.dto.InterestResponse;
import com.routemate.api.user.User;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interests")
@RequiredArgsConstructor
public class InterestController {

    private final InterestService interestService;

    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public InterestResponse send(@CurrentUser User user, @PathVariable UUID userId) {
        return interestService.send(user, userId);
    }

    @GetMapping("/incoming")
    public List<InterestResponse> incoming(@CurrentUser User user) {
        return interestService.incoming(user);
    }

    @PostMapping("/{interestId}/accept")
    public InterestResponse accept(@CurrentUser User user, @PathVariable UUID interestId) {
        return interestService.accept(user, interestId);
    }

    @PostMapping("/{interestId}/decline")
    public InterestResponse decline(@CurrentUser User user, @PathVariable UUID interestId) {
        return interestService.decline(user, interestId);
    }
}
