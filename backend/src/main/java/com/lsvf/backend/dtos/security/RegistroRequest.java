package com.lsvf.backend.dtos.security;

import lombok.Data;

@Data
public class RegistroRequest {
    private String nombre;
    private String correo;
    private String password;
    private String telefono;
}
