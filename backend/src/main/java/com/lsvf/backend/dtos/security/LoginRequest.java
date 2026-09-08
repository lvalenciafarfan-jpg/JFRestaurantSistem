package com.lsvf.backend.dtos.security;

import lombok.Data;

@Data
public class LoginRequest {
    private String correo;
    private String password;
}
