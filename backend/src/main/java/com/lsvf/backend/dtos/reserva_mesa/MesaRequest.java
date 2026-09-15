package com.lsvf.backend.dtos.reserva_mesa;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MesaRequest {

    @NotNull(message = "Debes indicar el id de la mesa, es obligatorio.")
    private Integer numeroMesa;

    @NotNull(message = "La capacidad de la mesa es obligatoria.")
    @Min(value = 1, message = "La capacidad de la mesa debe de ser minimo 1.")
    private Integer capacidad;
}
