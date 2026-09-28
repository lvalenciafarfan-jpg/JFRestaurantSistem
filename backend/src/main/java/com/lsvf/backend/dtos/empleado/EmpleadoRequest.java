package com.lsvf.backend.dtos.empleado;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmpleadoRequest {

    private Long usuarioId; // opcional

    @NotBlank(message = "El cargo es obligatorio")
    private String cargo;

    @NotNull(message = "La fecha de contratacion es obligatoria")
    private LocalDate fechaContratacion;

    @NotBlank(message = "El horario asignado es obligatorio")
    private String horarioAsignado;
}