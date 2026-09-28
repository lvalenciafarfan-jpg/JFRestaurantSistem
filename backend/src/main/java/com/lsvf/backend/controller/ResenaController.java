package com.lsvf.backend.controller;

import com.lsvf.backend.dtos.resena.ResenaRequest;
import com.lsvf.backend.dtos.resena.ResenaResponse;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.service.resena.ResenaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api")
public class ResenaController {

    private final ResenaService resenaService;

    public ResenaController(ResenaService resenaService) {
        this.resenaService = resenaService;
    }

    @GetMapping("/resenas")
    public ResponseEntity<Page<ResenaResponse>> listarResenas(
            @PageableDefault(size = 10, sort = "fecha", direction = Sort.Direction.DESC) Pageable pageable){

        return ResponseEntity.ok(resenaService.listarResenas(pageable));
    }

    @PostMapping("/resenas")
    public ResponseEntity<ResenaResponse> crearResena(
            @Valid @RequestBody ResenaRequest request,
            @AuthenticationPrincipal Usuario usuario){

        return ResponseEntity.status(HttpStatus.CREATED).body(resenaService.crearResena(request, usuario));

    }

    @DeleteMapping("/resenas/{id}")
    public ResponseEntity<Void> eliminarResena(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {

        resenaService.eliminarResena(usuario, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/resenas/promedio")
    public ResponseEntity<BigDecimal> promedioResenas() {
        return ResponseEntity.ok(resenaService.promedioResenas());
    }

}
