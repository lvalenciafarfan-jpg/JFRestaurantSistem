package com.lsvf.backend.service.resena;

import com.lsvf.backend.dtos.resena.ResenaRequest;
import com.lsvf.backend.dtos.resena.ResenaResponse;
import com.lsvf.backend.entities.Resena;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.usuario.Rol;
import com.lsvf.backend.exception.customs.RecursoNoEncontradoException;
import com.lsvf.backend.exception.customs.ReglaDeNegocioException;
import com.lsvf.backend.mappers.ResenaMapper;
import com.lsvf.backend.repository.ResenaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ResenaServiceimpl implements ResenaService{

    private final ResenaRepository resenaRepository;

    private final ResenaMapper resenaMapper;

    public ResenaServiceimpl(ResenaRepository resenaRepository, ResenaMapper resenaMapper) {
        this.resenaRepository = resenaRepository;
        this.resenaMapper = resenaMapper;
    }

    @Override
    public ResenaResponse crearResena(ResenaRequest request, Usuario usuario) {
        Resena resena = new Resena();

        resena.setFecha(LocalDateTime.now());
        resena.setCalificacion(request.getCalificacion());
        resena.setComentario(request.getComentario());
        resena.setUsuario(usuario);

        if (resenaRepository.existsByUsuarioId(usuario.getId())) {
            throw new ReglaDeNegocioException("Ya has dejado una reseña");
        }

        resenaRepository.save(resena);

        return resenaMapper.toResponse(resena);
    }

    @Override
    public Page<ResenaResponse> listarResenas(Pageable pageable) {
        return resenaRepository.findAll(pageable).map(resenaMapper::toResponse);
    }

    @Override
    public void eliminarResena(Usuario usuario, Long id) {

        Resena resena = resenaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("La resena con id: " + id + " no existe."));

        boolean esDueno = resena.getUsuario().getId().equals(usuario.getId());
        boolean esAdmin = usuario.getRolUsuario() == Rol.ADMIN;

        if (!esDueno && !esAdmin) {
            throw new ReglaDeNegocioException("No puedes eliminar una reseña que no es tuya");
        }

        resenaRepository.delete(resena);
    }

    @Override
    public BigDecimal promedioResenas() {
        return resenaRepository.promedio();
    }
}
