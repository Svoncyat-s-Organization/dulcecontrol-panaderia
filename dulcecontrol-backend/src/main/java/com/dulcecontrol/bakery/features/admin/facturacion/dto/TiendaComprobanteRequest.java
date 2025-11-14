package com.dulcecontrol.bakery.features.admin.facturacion.dto;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoDocumentoCliente;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TiendaComprobanteRequest {

    @NotNull(message = "El tiendaId es obligatorio")
    private Long tiendaId;

    @NotNull(message = "El pedidoId es obligatorio")
    private Long pedidoId;

    @NotNull(message = "El serieId es obligatorio")
    private Long serieId;

    @NotBlank(message = "La razón social del emisor es obligatoria")
    private String emisorRazonSocial;

    @NotBlank(message = "El RUC del emisor es obligatorio")
    @Pattern(regexp = "^\\d{11}$", message = "El RUC debe tener 11 dígitos")
    private String emisorRuc;

    @NotBlank(message = "La dirección del emisor es obligatoria")
    private String emisorDireccion;

    @NotNull(message = "El tipo de documento del cliente es obligatorio")
    private TipoDocumentoCliente clienteTipoDoc;

    @NotBlank(message = "El número de documento del cliente es obligatorio")
    @Size(max = 20, message = "El número de documento no puede exceder 20 caracteres")
    private String clienteNumeroDoc;

    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String clienteNombre;

    private String clienteDireccion;

    @NotNull(message = "El tipo de comprobante es obligatorio")
    private TipoComprobante tipoComprobante;

    @NotNull(message = "El correlativo es obligatorio")
    @Min(value = 1, message = "El correlativo debe ser mayor a 0")
    private Integer correlativo;

    private LocalDateTime fechaEmision;

    @Size(min = 3, max = 3, message = "La moneda debe tener 3 caracteres")
    private String moneda = "PEN";

    @Min(value = 0, message = "El total gravado no puede ser negativo")
    private Long totalGravadoCentimos = 0L;

    @Min(value = 0, message = "El total inafecto no puede ser negativo")
    private Long totalInafectoCentimos = 0L;

    @Min(value = 0, message = "El total exonerado no puede ser negativo")
    private Long totalExoneradoCentimos = 0L;

    @Min(value = 0, message = "El IGV no puede ser negativo")
    private Long totalIgvCentimos = 0L;

    @Min(value = 0, message = "Los impuestos a la bolsa no pueden ser negativos")
    private Long totalImpuestosBolsaCentimos = 0L;

    @NotNull(message = "El total del importe es obligatorio")
    @Min(value = 0, message = "El total no puede ser negativo")
    private Long totalImporteCentimos;
}
