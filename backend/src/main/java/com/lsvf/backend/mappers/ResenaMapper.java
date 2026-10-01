package com.lsvf.backend.mappers;

import com.lsvf.backend.dtos.resena.ResenaResponse;
import com.lsvf.backend.entities.Resena;
import org.springframework.stereotype.Component;

@Component
public class ResenaMapper {

    public ResenaResponse toResponse(Resena resena){
        ResenaResponse resenaResponse = new ResenaResponse();
        resenaResponse.setNombreUsuario(resena.getUsuario().getNombre());
        resenaResponse.setId(resena.getId());
        resenaResponse.setFecha(resena.getFecha());
        resenaResponse.setCalificacion(resena.getCalificacion());
        resenaResponse.setComentario(resena.getComentario());

        return resenaResponse;
    }
}
