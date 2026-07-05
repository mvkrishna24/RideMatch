package com.routemate.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class RoutemateApiApplicationTests {

    @Test
    void contextLoads() {
        // Boots the full application context against in-memory H2 with the
        // credential-less Firebase verifier fallback. Fails if wiring breaks.
    }
}
