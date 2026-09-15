package com.lsvf.backend.dtos.reserva_mesa;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservaRequest {

    @NotNull(message = "La cantidad de personas es obligatoria.")
    @Min(value = 1, message = "El minimo de cantidad de personas debe ser 1.")
    private Integer cantidadPersonas;

    @NotNull(message = "El id de la mesa es obligatorio")
    private Long numeroMesa;
}
