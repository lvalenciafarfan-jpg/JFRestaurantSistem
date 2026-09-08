package com.lsvf.backend.mappers;

import com.lsvf.backend.dtos.security.RegistroRequest;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.usuario.EstadoUsuario;
import com.lsvf.backend.enums.usuario.Rol;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RegistroMapper {

    private PasswordEncoder passwordEncoder;

    public RegistroMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario toEntity(RegistroRequest registro){
        Usuario usuario = new Usuario();
        usuario.setCorreo(registro.getCorreo());
        usuario.setNombre(registro.getNombre());
        usuario.setPassword(passwordEncoder.encode(registro.getPassword()));
        usuario.setTelefono(registro.getTelefono());
        usuario.setRolUsuario(Rol.CLIENTE);
        usuario.setEstadoCuenta(EstadoUsuario.ACTIVO);
        usuario.setFechaRegistro(LocalDateTime.now());

        return usuario;
    }
}
