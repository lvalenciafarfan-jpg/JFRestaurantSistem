package com.lsvf.backend.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String correo;
    private String password;
}
