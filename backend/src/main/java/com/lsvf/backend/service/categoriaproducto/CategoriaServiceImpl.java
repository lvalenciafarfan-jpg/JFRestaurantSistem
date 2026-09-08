package com.lsvf.backend.service.categoriaproducto;

import com.lsvf.backend.dtos.categoria.CategoriaRequest;
import com.lsvf.backend.dtos.categoria.CategoriaResponse;
import com.lsvf.backend.entities.CategoriaProducto;
import com.lsvf.backend.mappers.CategoriaMapper;
import com.lsvf.backend.repository.CategoriaProductoRepository;

import java.util.List;

public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaProductoRepository categoriaRepository;

    private final CategoriaMapper categoriaMapper;

    public CategoriaServiceImpl(CategoriaProductoRepository categoriaRepository, CategoriaMapper categoriaMapper) {
        this.categoriaRepository = categoriaRepository;
        this.categoriaMapper = categoriaMapper;
    }

    @Override
    public List<CategoriaResponse> allCategorias() {
        return categoriaRepository.findAll().stream().map(categoriaMapper::toResponse).toList();
    }

    @Override
    public CategoriaResponse crearCategoria(CategoriaRequest request) {
        CategoriaProducto categoriaProducto = categoriaMapper.toEntity(request);

        return categoriaMapper.toResponse(categoriaProducto);
    }
}
