package com.lsvf.backend.dtos.empleado;

import com.lsvf.backend.enums.empleado.EstadoEmpleado;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpleadoResponse {
    private Long id;
    private Long usuarioId;
    private String nombreUsuario;
    private String cargo;
    private LocalDate fechaContratacion;
    private EstadoEmpleado estado;
    private String horarioAsignado;
}