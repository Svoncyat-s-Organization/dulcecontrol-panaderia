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

import java.util.ArrayList;
import java.util.List;

/**
 * Configuración de OpenAPI (Swagger) para la documentación interactiva de la
 * API.
 * <p>
 * Accede a la interfaz en: http://localhost:2250/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    private final AppHostProperties hostProperties;
    private final int serverPort;

    public OpenApiConfig(AppHostProperties hostProperties, @Value("${server.port:2250}") int serverPort) {
        this.hostProperties = hostProperties;
        this.serverPort = serverPort;
    }

    @Bean
    public OpenAPI customOpenAPI() {
        // Definir el esquema de seguridad JWT
        final String securitySchemeName = "Bearer Authentication";

        List<Server> servers = new ArrayList<>();
        hostProperties.getOpenApiServers().forEach(descriptor ->
                servers.add(new Server().url(descriptor.getUrl()).description(descriptor.getDescription())));
        servers.add(new Server().url("https://localhost:" + serverPort).description("Servidor de Desarrollo Local"));

        return new OpenAPI()
                // Información general de la API
                .info(new Info()
                        .title("Dulce Control API")
                        .version("1.0.0")
                        .description("""
                                🍰 **API REST para la gestión integral de panaderías y pastelerías**
                                
                                Sistema multi-tenant que permite al Superadmin gestionar múltiples tiendas
                                con módulos completos de: Seguridad, Inventario, Ventas, Producción,
                                Facturación, Reportes y más.
                                
                                ---
                                
                                ### 🔐 Autenticación JWT
                                
                                Esta API utiliza autenticación stateless con tokens JWT (JSON Web Tokens).
                                
                                **Pasos para autenticarte:**
                                
                                1. **Obtenga sus credenciales:**
                                   - Vaya a: https://sa-dulcecontrol.vercel.app/token
                                   - Registre un usuario
                                   - Genere su token JWT
                                
                                2. **Autorice en Swagger:**
                                   - Haga clic en el botón **Authorize 🔓** (abajo a la derecha)
                                   - En el campo **Value** debe ingresar su token generado.
                                   - Haga clic en **Authorize** y luego **Close**
                                
                                3. **Pruebe los endpoints:**
                                   - ¡Listo! Ahora puede probar todos los endpoints 🎉 Solo seleccione uno de la lista de abajo, desglose y de click a Try it out. Ingrese los parametros necesarios si se requieren.
                                
                                ---
                                """)
                        .license(new License()
                                .name("Generador de tokens JWT")
                                .url("https://sa-dulcecontrol.vercel.app/token")))

                // Servidores disponibles
                .servers(servers)

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
