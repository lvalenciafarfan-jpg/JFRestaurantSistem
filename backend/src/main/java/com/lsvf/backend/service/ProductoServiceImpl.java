package com.lsvf.backend.service;

import com.lsvf.backend.dtos.producto.ProductoRequest;
import com.lsvf.backend.dtos.producto.ProductoResponse;
import com.lsvf.backend.entities.Producto;
import com.lsvf.backend.enums.DisponibilidadProducto;
import com.lsvf.backend.mappers.ProductoMapper;
import com.lsvf.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService{

    private final ProductoRepository productoRepository;

    private final ProductoMapper productoMapper;

    public ProductoServiceImpl(ProductoRepository productoRepository, ProductoMapper productoMapper){
        this.productoRepository = productoRepository;
        this.productoMapper = productoMapper;
    }

    public Producto encontrarProducto(Long id){
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id " + id));
    }

    @Override
    public List<ProductoResponse> allProductos() {
        return productoRepository.findAll().stream().map(productoMapper::toResponse).toList();
    }

    @Override
    public List<ProductoResponse> productosDisponibles() {
        return productoRepository.findByDisponibilidad(DisponibilidadProducto.ACTIVO)
                .stream()
                .map(productoMapper::toResponse)
                .toList();
    }

    @Override
    public ProductoResponse productoPorId(Long id) {
        Producto producto = encontrarProducto(id);

        return productoMapper.toResponse(producto);
    }

    @Override
    public ProductoResponse productoCreado(ProductoRequest request) {
        Producto producto = productoMapper.toEntity(request);

        productoRepository.save(producto);

        return productoMapper.toResponse(producto);
    }

    @Override
    public void desactivarProducto(Long id) {
        Producto producto = encontrarProducto(id);

        if(producto.getDisponibilidad() == DisponibilidadProducto.ACTIVO){
            producto.setDisponibilidad(DisponibilidadProducto.AGOTADO);
            productoRepository.save(producto);
        }
    }

    @Override
    public void activarProducto(Long id) {
        Producto producto = encontrarProducto(id);

        if(producto.getDisponibilidad() == DisponibilidadProducto.AGOTADO){
            producto.setDisponibilidad(DisponibilidadProducto.ACTIVO);
            productoRepository.save(producto);
        }
    }
}
