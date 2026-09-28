package com.lsvf.backend.mappers;

import com.lsvf.backend.dtos.empleado.EmpleadoRequest;
import com.lsvf.backend.dtos.empleado.EmpleadoResponse;
import com.lsvf.backend.entities.Empleado;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.empleado.EstadoEmpleado;
import org.springframework.stereotype.Component;

@Component
public class EmpleadoMapper {

    public Empleado toEntity(EmpleadoRequest request, Usuario usuario) {
        Empleado empleado = new Empleado();
        empleado.setUsuario(usuario); // puede ser null
        empleado.setCargo(request.getCargo());
        empleado.setFechaContratacion(request.getFechaContratacion());
        empleado.setHorarioAsignado(request.getHorarioAsignado());
        empleado.setEstado(EstadoEmpleado.ACTIVO);
        return empleado;
    }

    public EmpleadoResponse toResponse(Empleado empleado) {
        return new EmpleadoResponse(
                empleado.getId(),
                empleado.getUsuario() != null ? empleado.getUsuario().getId() : null,
                empleado.getUsuario() != null ? empleado.getUsuario().getNombre() : null,
                empleado.getCargo(),
                empleado.getFechaContratacion(),
                empleado.getEstado(),
                empleado.getHorarioAsignado()
        );
    }
}
