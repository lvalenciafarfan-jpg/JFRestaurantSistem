package com.lsvf.backend.mappers;

import com.lsvf.backend.dtos.producto.ProductoRequest;
import com.lsvf.backend.dtos.producto.ProductoResponse;
import com.lsvf.backend.entities.CategoriaProducto;
import com.lsvf.backend.entities.Producto;
import com.lsvf.backend.repository.CategoriaProductoRepository;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    private final CategoriaProductoRepository categoriaProductoRepository;

    public ProductoMapper(CategoriaProductoRepository categoriaProductoRepository) {
        this.categoriaProductoRepository = categoriaProductoRepository;
    }

    public Producto toEntity(ProductoRequest request){
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setDescripcion(request.getDescripcion());
        producto.setDisponibilidad(request.getDisponibilidadProducto());
        producto.setUrlImagen(request.getUrlImagen());

        CategoriaProducto categoriaProducto = categoriaProductoRepository.findById(request.getCategoriaId())
                        .orElseThrow(() -> new RuntimeException("Categoria no encontrada."));

        producto.setCategoriaProducto(categoriaProducto);

        return producto;
    }

    public ProductoResponse toResponse(Producto producto){
        ProductoResponse productoResponse = new ProductoResponse();
        productoResponse.setNombre(producto.getNombre());
        productoResponse.setPrecio(producto.getPrecio());
        productoResponse.setDescripcion(producto.getDescripcion());
        productoResponse.setUrlImagen(producto.getUrlImagen());
        productoResponse.setDisponibilidadProducto(producto.getDisponibilidad());

        return productoResponse;
    }
}
