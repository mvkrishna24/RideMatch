package com.routemate.api.user.dto;

import com.routemate.api.user.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateMeRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 120) String college,
        @NotBlank @Size(max = 60) String branch,
        @NotBlank @Size(max = 10) String year,
        @NotNull Gender gender) {}
