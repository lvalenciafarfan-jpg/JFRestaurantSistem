package com.lsvf.backend.controller;

import com.lsvf.backend.dtos.reserva_mesa.ReservaRequest;
import com.lsvf.backend.dtos.reserva_mesa.ReservaResponse;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.mesa.EstadoReserva;
import com.lsvf.backend.service.reservamesa.ReservaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService){
        this.reservaService = reservaService;
    }

    @PostMapping("/reservas")
    public ResponseEntity<ReservaResponse> crearReserva(@Valid @RequestBody ReservaRequest request, @AuthenticationPrincipal Usuario usuario){
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.crearReserva(request, usuario));
    }

    @GetMapping("/reservas/mias")
    public ResponseEntity<List<ReservaResponse>> listarReservasUsuario(@AuthenticationPrincipal Usuario usuario){
        return ResponseEntity.ok(reservaService.listarReservas(usuario));
    }

    @GetMapping("/reservas/{id}")
    public ResponseEntity<ReservaResponse> listarReserva(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario){
        return ResponseEntity.ok(reservaService.listarReservaId(usuario, id));
    }

    @PutMapping("/reservas/{id}/estado")
    public ResponseEntity<ReservaResponse> actualizarEstadoReserva(@RequestParam("nuevoEstado") EstadoReserva estado, @PathVariable Long id){
        return ResponseEntity.ok(reservaService.cambiarEstadoReserva(estado, id));
    }

    @GetMapping("/reservas")
    public ResponseEntity<List<ReservaResponse>> listarTodasReservasDesde(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        return ResponseEntity.ok(reservaService.listarTodasLasReservas(desde, hasta));
    }

    @PutMapping("/reservas/{id}/cancelar")
    public ResponseEntity<ReservaResponse> cancelarReserva(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {

        return ResponseEntity.ok(reservaService.cancelarReserva(usuario, id));
    }

}
