package com.routemate.api.auth;

/**
 * Thin seam over Firebase Admin token verification so the filter can be
 * tested without talking to Google, and so local dev without credentials
 * fails with a clear message instead of a stack trace.
 */
public interface FirebaseTokenVerifier {

    DecodedToken verify(String idToken) throws Exception;

    record DecodedToken(String uid, String email) {}
}
