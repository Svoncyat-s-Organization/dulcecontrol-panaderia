package com.dulcecontrol.bakery.entity;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuario", schema = "dulce_control")
// Cuando se llame al método delete, se ejecutará este SQL en su lugar.
@SQLDelete(sql = "UPDATE dulce_control.usuario SET activo = false, actualizado_en = NOW() WHERE id = ?")
// Todas las consultas a esta entidad incluirán automáticamente esta condición.
@SQLRestriction("activo = true")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 120, message = "Los nombres no pueden exceder 120 caracteres")
    @Column(length = 120, nullable = false)
    private String nombres;

    @Size(max = 120, message = "Los apellidos no pueden exceder 120 caracteres")
    @Column(length = 120)
    private String apellidos;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe ser un email válido")
    @Column(nullable = false, unique = true, columnDefinition = "citext")
    private String email;

    @Pattern(regexp = "^[0-9 +()-]{6,20}$", message = "Teléfono debe contener entre 6 y 20 caracteres")
    @Column(length = 20)
    private String telefono;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 60, max = 200, message = "El hash de contraseña debe tener entre 60 y 200 caracteres")
    @Column(name = "contrasena_hash", length = 200, nullable = false)
    private String contrasenaHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_preferida_id")
    private Sede sedePreferida;

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

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getContrasenaHash() {
        return contrasenaHash;
    }

    public void setContrasenaHash(String contrasenaHash) {
        this.contrasenaHash = contrasenaHash;
    }

    public Sede getSedePreferida() {
        return sedePreferida;
    }

    public void setSedePreferida(Sede sedePreferida) {
        this.sedePreferida = sedePreferida;
    }

    // Método de compatibilidad para mantener API existente
    public Long getSedePreferidaId() {
        return sedePreferida != null ? sedePreferida.getId() : null;
    }

    public void setSedePreferidaId(Long sedePreferidaId) {
        if (sedePreferidaId != null) {
            this.sedePreferida = new Sede();
            this.sedePreferida.setId(sedePreferidaId);
        } else {
            this.sedePreferida = null;
        }
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
        return "Usuario [id=" + id + ", nombres=" + nombres + ", apellidos=" + apellidos + ", email=" + email
                + ", telefono=" + telefono + ", contrasenaHash=" + contrasenaHash + ", sedePreferidaId="
                + getSedePreferidaId()
                + ", activo=" + activo + ", creadoEn=" + creadoEn + ", actualizadoEn=" + actualizadoEn + "]";
    }
}