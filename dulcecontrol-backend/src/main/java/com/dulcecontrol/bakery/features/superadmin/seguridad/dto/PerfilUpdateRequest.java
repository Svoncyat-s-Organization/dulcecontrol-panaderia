package com.dulcecontrol.bakery.features.superadmin.seguridad.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PerfilUpdateRequest {
    
    @Email(message = "El correo electrónico no es válido")
    @Size(max = 255, message = "El correo no puede exceder 255 caracteres")
    private String correo;
    
    @Size(min = 3, max = 255, message = "El nombre debe tener entre 3 y 255 caracteres")
    private String nombres;
    
    @Size(min = 7, max = 50, message = "El teléfono debe tener entre 7 y 50 caracteres")
    private String telefono;
    
    @Size(min = 6, max = 100, message = "La contraseña actual debe tener entre 6 y 100 caracteres")
    private String contrasenaActual;
    
    @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    private String nuevaContrasena;
}
