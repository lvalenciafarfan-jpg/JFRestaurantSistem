package com.lsvf.backend.service.resena;

import com.lsvf.backend.dtos.resena.ResenaRequest;
import com.lsvf.backend.dtos.resena.ResenaResponse;
import com.lsvf.backend.entities.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ResenaService {

    ResenaResponse crearResena(ResenaRequest request, Usuario usuario);

    Page<ResenaResponse> listarResenas(Pageable pageable);

    void eliminarResena(Usuario usuario, Long id);

    BigDecimal promedioResenas();
}
