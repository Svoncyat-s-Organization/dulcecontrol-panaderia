package com.dulcecontrol.bakery.shared.integration.decolecta;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "decolecta")
public class DecolectaProperties {
    private String baseUrl = "https://api.decolecta.com/v1";
    private String apiToken;
}
