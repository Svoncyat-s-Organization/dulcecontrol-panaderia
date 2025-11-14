package com.dulcecontrol.bakery.feature.admin.seguridad.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AsignarSedesRequest {

    @NotEmpty(message = "Debe asignar al menos una sede")
    private List<Long> sedeIds;

    private Long sedePrincipalId;
}
