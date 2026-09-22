package com.lsvf.backend.controller;

import com.lsvf.backend.dtos.reserva_mesa.MesaRequest;
import com.lsvf.backend.dtos.reserva_mesa.MesaResponse;
import com.lsvf.backend.service.reservamesa.MesaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    private final MesaService mesaService;

    public MesaController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @PostMapping
    public ResponseEntity<MesaResponse> crearMesa(@Valid @RequestBody MesaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mesaService.crearMesa(request));
    }

    @GetMapping
    public ResponseEntity<List<MesaResponse>> listarMesas() {
        return ResponseEntity.ok(mesaService.listarMesas());
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<MesaResponse>> listarMesasDisponibles() {
        return ResponseEntity.ok(mesaService.listarMesasDisponibles());
    }
}