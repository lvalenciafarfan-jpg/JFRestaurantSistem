package com.lsvf.backend.mappers;

import com.lsvf.backend.dtos.categoria.CategoriaRequest;
import com.lsvf.backend.dtos.categoria.CategoriaResponse;
import com.lsvf.backend.entities.CategoriaProducto;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public CategoriaProducto toEntity(CategoriaRequest categoriaRequest){
        CategoriaProducto categoriaProducto = new CategoriaProducto();
        categoriaProducto.setNombre(categoriaRequest.getNombre());

        return categoriaProducto;
    }

    public CategoriaResponse toResponse (CategoriaProducto categoriaProducto){
        CategoriaResponse categoriaResponse = new CategoriaResponse();
        categoriaResponse.setNombre(categoriaProducto.getNombre());

        return categoriaResponse;
    }

}
