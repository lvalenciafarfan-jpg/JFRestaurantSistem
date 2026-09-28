package com.lsvf.backend.dtos.security;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginRequest {

    @NotNull(message = "El correo es obligatorio.")
    private String correo;

    @NotNull(message = "La contraseña es obligatoria.")
    private String password;
}
