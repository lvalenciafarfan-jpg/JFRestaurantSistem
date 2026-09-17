package com.lsvf.backend.dtos.reserva_mesa;

import com.lsvf.backend.enums.mesa.EstadoReserva;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReservaResponse {

    private Long id;

    private MesaResponse mesaResponse;

    private LocalDateTime horaInicio;

    private LocalDateTime horaFin;

    private Integer cantidadPersonas;

    private EstadoReserva estadoReserva;
}
