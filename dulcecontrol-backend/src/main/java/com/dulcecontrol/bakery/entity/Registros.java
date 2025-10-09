package com.dulcecontrol.bakery.entity;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "registros", schema = "dulce_control")

@SQLDelete(sql = "UPDATE registros SET estado=0 WHERE idregistro=?")

/*
 * Cuando el modelo reciba del controlador el método para eliminar
 * un registro, lo que hará el modelo será cambiar el valor de
 * el campo estado = 0 (borrado lógico :3)
 */

@SQLRestriction("estado=1")
// Esto permite que se muestren solo los registros con estado = 1

public class Registros {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idregistro")
    private Integer idregistro;

    @Column(name = "nombres")
    private String nombres;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name = "email")
    private String email;

    @Column(name = "cliente_id")
    private String cliente_id;

    @Column(name = "llave_secreta")
    private String llave_secreta;

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "estado")
    private Integer estado = 1;

    public Integer getIdregistro() {
        return idregistro;
    }

    public void setIdregistro(Integer idregistro) {
        this.idregistro = idregistro;
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

    public String getCliente_id() {
        return cliente_id;
    }

    public void setCliente_id(String cliente_id) {
        // Validar que los datos necesarios existen
        if (nombres == null || apellidos == null || email == null) {
            this.cliente_id = cliente_id;
            return;
        }

        String datos = nombres + apellidos + email;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(datos.getBytes());
            byte[] digest = md.digest();
            String result = new BigInteger(1, digest).toString(16).toLowerCase();
            this.cliente_id = result;
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            this.cliente_id = cliente_id;
        }
    }

    public String getLlave_secreta() {
        return llave_secreta;
    }

    public void setLlave_secreta(String llave_secreta) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        this.llave_secreta = encoder.encode(llave_secreta);
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    @Override
    public String toString() {
        return "Registros [idregistro=" + idregistro + ", nombres=" + nombres + ", apellidos=" + apellidos + ", email="
                + email + ", cliente_id=" + cliente_id + ", llave_secreta=" + llave_secreta + ", accessToken="
                + accessToken + ", estado=" + estado
                + "]";
    }

}
