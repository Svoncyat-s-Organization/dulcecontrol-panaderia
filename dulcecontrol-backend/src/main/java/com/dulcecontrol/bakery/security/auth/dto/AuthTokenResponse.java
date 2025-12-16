package com.dulcecontrol.bakery.security.auth.dto;

import com.dulcecontrol.bakery.security.TipoUsuario;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthTokenResponse {

    private final String token;
    private final String tokenType;
    private final Long expiresIn;
    private final TipoUsuario userType;
    private final Long tiendaId;
    private final Long userId;
    private final SubscriptionStatusPayload subscriptionStatus;
}
