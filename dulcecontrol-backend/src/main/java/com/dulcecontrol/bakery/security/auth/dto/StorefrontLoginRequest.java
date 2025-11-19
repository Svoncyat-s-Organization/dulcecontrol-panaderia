package com.dulcecontrol.bakery.security.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StorefrontLoginRequest {

    @NotNull
    private Long tiendaId;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
