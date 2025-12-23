package com.dulcecontrol.bakery.shared.integration.decolecta.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReniecDniResponse {
    
    @JsonProperty("first_name")
    private String firstName;
    
    @JsonProperty("first_last_name")
    private String firstLastName;
    
    @JsonProperty("second_last_name")
    private String secondLastName;
    
    @JsonProperty("full_name")
    private String fullName;
    
    @JsonProperty("document_number")
    private String documentNumber;
}
