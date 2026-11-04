package com.lsvf.backend.controller;

import com.lsvf.backend.dtos.usuario.UsuarioResponse;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.usuario.Rol;
import com.lsvf.backend.exception.customs.RecursoNoEncontradoException;
import com.lsvf.backend.exception.customs.ReglaDeNegocioException;
import com.lsvf.backend.repository.UsuarioRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;
    public UsuarioController(UsuarioRepository usuarioRepository) { this.usuarioRepository = usuarioRepository; }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(this::toResponse).toList();
    }

    @PutMapping("/{id}/rol")
    public UsuarioResponse cambiarRol(@PathVariable Long id,
                                      @RequestParam Rol nuevoRol,
                                      @AuthenticationPrincipal Usuario admin) {
        if (admin.getId().equals(id)) {
            throw new ReglaDeNegocioException("No puedes cambiar tu propio rol.");
        }
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con id " + id));
        u.setRolUsuario(nuevoRol);
        usuarioRepository.save(u);
        return toResponse(u);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getCorreo(), u.getTelefono(),
                u.getRolUsuario(), u.getEstadoCuenta(), u.getFechaRegistro());
    }
}