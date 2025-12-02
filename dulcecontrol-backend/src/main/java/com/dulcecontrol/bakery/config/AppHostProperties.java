package com.dulcecontrol.bakery.config;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Hosts y servidores que representan los orígenes válidos para este backend.
 */
@Component
public class AppHostProperties {

    private final List<String> developmentOrigins = List.of(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5175"
    );

    private final List<String> productionOrigins = List.of(
            "https://sa-dulcecontrol.vercel.app",
            "https://dulcecontrol-superadmin.vercel.app",
            "https://dulcecontrol-admin.vercel.app",
            "https://dulcecontrol-storefront.vercel.app"
    );

    private final List<String> allowedOriginPatterns = List.of(
            "https://*.vercel.app",
            "https://*.informaticapp.com"
    );

    private final List<OpenApiServerDescriptor> openApiServers = List.of(
            new OpenApiServerDescriptor("https://pasteleria.spring.informaticapp.com:2250", "Servidor de Producción (HTTPS)")
    );

    public List<String> getDevelopmentOrigins() {
        return developmentOrigins;
    }

    public List<String> getProductionOrigins() {
        return productionOrigins;
    }

    public List<String> getAllowedOriginPatterns() {
        return allowedOriginPatterns;
    }

    public List<OpenApiServerDescriptor> getOpenApiServers() {
        return openApiServers;
    }

    public static final class OpenApiServerDescriptor {

        private final String url;
        private final String description;

        public OpenApiServerDescriptor(String url, String description) {
            this.url = url;
            this.description = description;
        }

        public String getUrl() {
            return url;
        }

        public String getDescription() {
            return description;
        }
    }
}