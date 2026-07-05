package com.routemate.api.safety;

import com.routemate.api.auth.CurrentUser;
import com.routemate.api.safety.dto.ReportRequest;
import com.routemate.api.user.User;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SafetyController {

    private final SafetyService safetyService;

    @PostMapping("/blocks/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void block(@CurrentUser User user, @PathVariable UUID userId) {
        safetyService.block(user, userId);
    }

    @PostMapping("/reports/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void report(
            @CurrentUser User user,
            @PathVariable UUID userId,
            @Valid @RequestBody ReportRequest request) {
        safetyService.report(user, userId, request.reason());
    }
}
