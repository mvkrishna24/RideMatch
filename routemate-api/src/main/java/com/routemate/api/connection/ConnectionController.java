package com.routemate.api.connection;

import com.routemate.api.auth.CurrentUser;
import com.routemate.api.connection.dto.ConnectionResponse;
import com.routemate.api.user.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @GetMapping
    public List<ConnectionResponse> list(@CurrentUser User user) {
        return connectionService.listFor(user);
    }
}
