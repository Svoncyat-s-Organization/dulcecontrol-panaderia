package com.dulcecontrol.bakery.entity;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "sede", schema = "dulce_control")
// Cuando se llame al método delete, se ejecutará este SQL en su lugar.
@SQLDelete(sql = "UPDATE dulce_control.sede SET activo = false, actualizado_en = NOW() WHERE id = ?")
// Todas las consultas a esta entidad incluirán automáticamente esta condición.
@SQLRestriction("activo = true")
public class Sede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la sede es obligatorio")
    @Size(max = 120, message = "El nombre no puede exceder 120 caracteres")
    @Column(length = 120, nullable = false)
    private String nombre;

    @Size(max = 250, message = "La dirección no puede exceder 250 caracteres")
    @Column(length = 250)
    private String direccion;

    @Pattern(regexp = "^[0-9 +()-]{6,20}$", message = "Teléfono debe contener entre 6 y 20 caracteres (números, espacios, +, -, paréntesis)")
    @Column(length = 20)
    private String telefono;

    // Se inicializa en true por defecto.
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private OffsetDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private OffsetDateTime actualizadoEn;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public OffsetDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(OffsetDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public OffsetDateTime getActualizadoEn() {
        return actualizadoEn;
    }

    public void setActualizadoEn(OffsetDateTime actualizadoEn) {
        this.actualizadoEn = actualizadoEn;
    }

    @Override
    public String toString() {
        return "Sede [id=" + id + ", nombre=" + nombre + ", direccion=" + direccion + ", telefono=" + telefono
                + ", activo=" + activo + ", creadoEn=" + creadoEn + ", actualizadoEn=" + actualizadoEn + "]";
    }
}