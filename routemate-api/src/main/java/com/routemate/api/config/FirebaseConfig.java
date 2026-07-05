package com.routemate.api.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.routemate.api.auth.FirebaseTokenVerifier;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Initializes the Firebase Admin SDK from one of:
 *   1. FIREBASE_SERVICE_ACCOUNT env var containing the raw service-account
 *      JSON (how Railway/production injects it), or
 *   2. GOOGLE_APPLICATION_CREDENTIALS pointing at a JSON file (local dev).
 *
 * Without credentials the app still boots (so /health and tests work), but
 * every token verification fails with a clear message.
 */
@Configuration
@Slf4j
public class FirebaseConfig {

    @Bean
    public FirebaseTokenVerifier firebaseTokenVerifier() {
        FirebaseApp app = initFirebaseApp();
        if (app == null) {
            return idToken -> {
                throw new IllegalStateException(
                        "Firebase Admin SDK is not configured. Set FIREBASE_SERVICE_ACCOUNT "
                                + "or GOOGLE_APPLICATION_CREDENTIALS.");
            };
        }

        FirebaseAuth firebaseAuth = FirebaseAuth.getInstance(app);
        return idToken -> {
            FirebaseToken token = firebaseAuth.verifyIdToken(idToken);
            return new FirebaseTokenVerifier.DecodedToken(token.getUid(), token.getEmail());
        };
    }

    private FirebaseApp initFirebaseApp() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }
        try {
            GoogleCredentials credentials = loadCredentials();
            if (credentials == null) {
                log.warn(
                        "No Firebase credentials found — token verification disabled. "
                                + "Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.");
                return null;
            }
            FirebaseApp app =
                    FirebaseApp.initializeApp(
                            FirebaseOptions.builder().setCredentials(credentials).build());
            log.info("Firebase Admin SDK initialized.");
            return app;
        } catch (IOException e) {
            log.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage());
            return null;
        }
    }

    private GoogleCredentials loadCredentials() throws IOException {
        String inlineJson = System.getenv("FIREBASE_SERVICE_ACCOUNT");
        if (inlineJson != null && !inlineJson.isBlank()) {
            return GoogleCredentials.fromStream(
                    new ByteArrayInputStream(inlineJson.getBytes(StandardCharsets.UTF_8)));
        }
        if (System.getenv("GOOGLE_APPLICATION_CREDENTIALS") != null) {
            return GoogleCredentials.getApplicationDefault();
        }
        return null;
    }
}
