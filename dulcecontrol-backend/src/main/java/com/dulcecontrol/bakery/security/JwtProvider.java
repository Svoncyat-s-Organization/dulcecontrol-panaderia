package com.dulcecontrol.bakery.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtProvider {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private Long expirationTime;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generarToken(String correo, String rolId) {
        return generarToken(correo, rolId, TipoUsuario.DEVELOPER, null);
    }

    public String generarToken(String correo, String rol, TipoUsuario tipoUsuario, Long tiendaId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol_id", rol);
        claims.put("tipo_usuario", tipoUsuario != null ? tipoUsuario.name() : null);
        if (tiendaId != null) {
            claims.put("tienda_id", tiendaId);
        }

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(correo)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extraerCorreo(String token) {
        return extraerClaims(token).getSubject();
    }

    public String extraerRolId(String token) {
        return extraerClaims(token).get("rol_id", String.class);
    }

    public TipoUsuario extraerTipoUsuario(String token) {
        String rawTipo = extraerClaims(token).get("tipo_usuario", String.class);
        if (rawTipo == null) {
            return null;
        }
        try {
            return TipoUsuario.valueOf(rawTipo);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    public Long extraerTiendaId(String token) {
        Claims claims = extraerClaims(token);
        Object tiendaId = claims.get("tienda_id");
        if (tiendaId instanceof Number number) {
            return number.longValue();
        }
        return null;
    }

    public Date extraerExpiracion(String token) {
        return extraerClaims(token).getExpiration();
    }

    private Claims extraerClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public boolean validarToken(String token) {
        try {
            extraerClaims(token);
            return !tokenExpirado(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean tokenExpirado(String token) {
        return extraerExpiracion(token).before(new Date());
    }

    public Long getExpirationTime() {
        return expirationTime / 1000; // Convertir a segundos
    }
}
