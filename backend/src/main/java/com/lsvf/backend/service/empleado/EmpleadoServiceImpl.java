package com.lsvf.backend.service.empleado;

import com.lsvf.backend.dtos.empleado.EmpleadoRequest;
import com.lsvf.backend.dtos.empleado.EmpleadoResponse;
import com.lsvf.backend.entities.Empleado;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.empleado.EstadoEmpleado;
import com.lsvf.backend.exception.customs.RecursoNoEncontradoException;
import com.lsvf.backend.mappers.EmpleadoMapper;
import com.lsvf.backend.repository.EmpleadoRepository;
import com.lsvf.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoMapper empleadoMapper;

    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepository,
                               UsuarioRepository usuarioRepository,
                               EmpleadoMapper empleadoMapper) {
        this.empleadoRepository = empleadoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empleadoMapper = empleadoMapper;
    }

    @Override
    public EmpleadoResponse crearEmpleado(EmpleadoRequest request) {
        Usuario usuario = null;

        if (request.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(request.getUsuarioId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "Usuario no encontrado con id " + request.getUsuarioId()));
        }

        Empleado empleado = empleadoMapper.toEntity(request, usuario);
        empleadoRepository.save(empleado);

        return empleadoMapper.toResponse(empleado);
    }

    @Override
    public EmpleadoResponse editarEmpleado(Long id, EmpleadoRequest request) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado con id " + id));

        empleado.setCargo(request.getCargo());
        empleado.setFechaContratacion(request.getFechaContratacion());
        empleado.setHorarioAsignado(request.getHorarioAsignado());

        empleadoRepository.save(empleado);

        return empleadoMapper.toResponse(empleado);
    }

    @Override
    public void desactivarEmpleado(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado con id " + id));

        empleado.setEstado(EstadoEmpleado.INACTIVO);
        empleadoRepository.save(empleado);
    }

    @Override
    public List<EmpleadoResponse> listarEmpleados() {
        return empleadoRepository.findAll().stream().map(empleadoMapper::toResponse).toList();
    }
}
