package com.dulcecontrol.bakery.security.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuperadminLoginRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
