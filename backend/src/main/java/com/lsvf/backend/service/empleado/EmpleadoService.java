package com.lsvf.backend.service.empleado;

import com.lsvf.backend.dtos.empleado.EmpleadoRequest;
import com.lsvf.backend.dtos.empleado.EmpleadoResponse;

import java.util.List;

public interface EmpleadoService {
    EmpleadoResponse crearEmpleado(EmpleadoRequest request);
    EmpleadoResponse editarEmpleado(Long id, EmpleadoRequest request);
    void desactivarEmpleado(Long id);
    List<EmpleadoResponse> listarEmpleados();
}