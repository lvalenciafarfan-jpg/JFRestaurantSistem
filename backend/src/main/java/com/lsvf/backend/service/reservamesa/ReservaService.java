package com.lsvf.backend.service.reservamesa;

import com.lsvf.backend.dtos.reserva_mesa.ReservaRequest;
import com.lsvf.backend.dtos.reserva_mesa.ReservaResponse;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.mesa.EstadoReserva;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservaService {
    ReservaResponse crearReserva(ReservaRequest request, Usuario usuario);

    ReservaResponse listarReservaId(Usuario usuario, Long id);

    List<ReservaResponse> listarReservas(Usuario usuario);

    ReservaResponse cambiarEstadoReserva(EstadoReserva estadoReserva, Long id);

    ReservaResponse cancelarReserva(Usuario usuario, Long id);

    List<ReservaResponse> listarTodasLasReservas(LocalDateTime desde, LocalDateTime hasta);
}
