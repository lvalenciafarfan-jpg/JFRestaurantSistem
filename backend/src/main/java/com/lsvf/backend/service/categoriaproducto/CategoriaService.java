package com.lsvf.backend.service.categoriaproducto;

import com.lsvf.backend.dtos.categoria.CategoriaRequest;
import com.lsvf.backend.dtos.categoria.CategoriaResponse;

import java.util.List;

public interface CategoriaService {

    List<CategoriaResponse> allCategorias();

    CategoriaResponse crearCategoria(CategoriaRequest request);
}
