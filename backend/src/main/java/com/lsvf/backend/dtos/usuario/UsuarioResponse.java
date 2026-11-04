package com.lsvf.backend.dtos.usuario;

import com.lsvf.backend.enums.usuario.EstadoUsuario;
import com.lsvf.backend.enums.usuario.Rol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String correo;
    private String telefono;
    private Rol rol;
    private EstadoUsuario estado;
    private LocalDateTime fechaRegistro;
}
