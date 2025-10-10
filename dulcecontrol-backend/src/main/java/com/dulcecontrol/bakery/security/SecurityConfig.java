package com.dulcecontrol.bakery.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            JwtFilter jwtFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/restful/token",
                                "/restful/registros/**",
                                "/restful/cajaSesion/**",
                                "/restful/categoriaProducto/**",
                                "/restful/cliente/**",
                                "/restful/compra/**",
                                "/restful/compraInsumoItem/**",
                                "/restful/conteoMatutino/**",
                                "/restful/conteoMatutinoItem/**",
                                "/restful/gasto/**",
                                "/restful/insumo/**",
                                "/restful/inventarioConfig/**",
                                "/restful/inventarioProducto/**",
                                "/restful/pagoPedido/**",
                                "/restful/pagoVenta/**",
                                "/restful/pedido/**",
                                "/restful/pedidoAdjunto/**",
                                "/restful/pedidoEntrega/**",
                                "/restful/pedidoItem/**",
                                "/restful/permiso/**",
                                "/restful/planProduccion/**",
                                "/restful/planProduccionItem/**",
                                "/restful/producto/**",
                                "/restful/productoImagen/**",
                                "/restful/proveedor/**",
                                "/restful/receta/**",
                                "/restful/recetaItem/**",
                                "/restful/rol/**",
                                "/restful/rolPermiso/**",
                                "/restful/sede/**",
                                "/restful/usuario/**",
                                "/restful/usuarioRecuperacion/**",
                                "/restful/usuarioRol/**",
                                "/restful/usuarioSede/**",
                                "/restful/venta/**",
                                "/restful/ventaItem/**")
                        .permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
