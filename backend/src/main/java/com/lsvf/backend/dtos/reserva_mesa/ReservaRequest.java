package com.lsvf.backend.dtos.reserva_mesa;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservaRequest {

    @NotNull(message = "La cantidad de personas es obligatoria.")
    @Min(value = 1, message = "El minimo de cantidad de personas debe ser 1.")
    private Integer cantidadPersonas;

    @NotNull(message = "El id de la mesa es obligatorio")
    private Long id_mesa;

    @NotNull(message = "La hora de inicio es obligatoria.")
    @Future(message = "La reserva debe ser en una fecha futura")
    private LocalDateTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria.")
    @Future(message = "La reserva debe ser en una fecha futura")
    private LocalDateTime horaFin;
}
