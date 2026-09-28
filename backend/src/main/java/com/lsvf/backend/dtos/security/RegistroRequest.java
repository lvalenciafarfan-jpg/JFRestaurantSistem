package com.lsvf.backend.dtos.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistroRequest {

    @NotBlank(message = "El nombre es obligatorio.")
    private String nombre;

    @NotNull(message = "El correo es obligatorio.")
    private String correo;

    @NotNull(message = "La password es obligatoria.")
    private String password;

    private String telefono;
}
