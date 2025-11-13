package com.dulcecontrol.bakery.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración de OpenAPI (Swagger) para la documentación interactiva de la
 * API.
 * 
 * Accede a la interfaz en: http://localhost:2250/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.port:2250}")
    private int serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        // Definir el esquema de seguridad JWT
        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()
                // Información general de la API
                .info(new Info()
                        .title("Dulce Control API")
                        .version("1.0.0")
                        .description("""
                                API REST para la gestión integral de panaderías y pastelerías.

                                **Características:**
                                - Multi-tenant (Superadmin gestiona múltiples tiendas)
                                - Autenticación JWT stateless
                                - Módulos: Seguridad, Inventario, Ventas, Producción, Facturación, etc.

                                **Autenticación:**
                                1. Obtén un token haciendo login en `/api/v1/auth/login`
                                2. Haz clic en el botón **Authorize** 🔓 (arriba a la derecha)
                                3. Ingresa: `Bearer {tu_token_aqui}`
                                4. ¡Listo! Ahora puedes probar todos los endpoints protegidos 🎉
                                """)
                        .contact(new Contact()
                                .name("Equipo Dulce Control")
                                .email("soporte@dulcecontrol.pe"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))

                // Servidor local
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Servidor de Desarrollo Local")))

                // Configuración de seguridad JWT
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Ingresa tu token JWT en el formato: Bearer {token}")));
    }
}
