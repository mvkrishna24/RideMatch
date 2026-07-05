package com.routemate.api.safety.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReportRequest(@NotBlank @Size(max = 1000) String reason) {}
