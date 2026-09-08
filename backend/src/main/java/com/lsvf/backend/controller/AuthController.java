package com.lsvf.backend.controller;

import com.lsvf.backend.dtos.security.AuthResponse;
import com.lsvf.backend.dtos.security.LoginRequest;
import com.lsvf.backend.dtos.security.RegistroRequest;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.mappers.RegistroMapper;
import com.lsvf.backend.repository.UsuarioRepository;
import com.lsvf.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RegistroMapper registroMapper;

    public AuthController(UsuarioRepository usuarioRepository, JwtService jwtService, AuthenticationManager authenticationManager, RegistroMapper registroMapper) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.registroMapper = registroMapper;
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registro(@RequestBody RegistroRequest request){
        Usuario usuario = registroMapper.toEntity(request);
        usuarioRepository.save(usuario);

        String token = jwtService.generarToken(usuario);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
        );

        UserDetails usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.generarToken(usuario);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
