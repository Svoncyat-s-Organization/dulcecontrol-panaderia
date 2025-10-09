package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "receta_item", schema = "dulce_control")
public class RecetaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receta_id", nullable = false)
    private Receta receta;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 4, nullable = false)
    private BigDecimal cantidad;

    @NotBlank
    @Size(max = 30)
    @Column(name = "unidad_medida", length = 30, nullable = false)
    private String unidadMedida;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Receta getReceta() {
        return receta;
    }

    public void setReceta(Receta receta) {
        this.receta = receta;
    }

    // Compatibility method
    public Long getRecetaId() {
        return receta != null ? receta.getId() : null;
    }

    public void setRecetaId(Long recetaId) {
        if (recetaId != null) {
            this.receta = new Receta();
            this.receta.setId(recetaId);
        } else {
            this.receta = null;
        }
    }

    public Insumo getInsumo() {
        return insumo;
    }

    public void setInsumo(Insumo insumo) {
        this.insumo = insumo;
    }

    // Compatibility method
    public Long getInsumoId() {
        return insumo != null ? insumo.getId() : null;
    }

    public void setInsumoId(Long insumoId) {
        if (insumoId != null) {
            this.insumo = new Insumo();
            this.insumo.setId(insumoId);
        } else {
            this.insumo = null;
        }
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    @Override
    public String toString() {
        return "RecetaItem [id=" + id + ", recetaId=" + getRecetaId() + ", insumoId=" + getInsumoId() + ", cantidad=" + cantidad
                + ", unidadMedida=" + unidadMedida + "]";
    }
}
