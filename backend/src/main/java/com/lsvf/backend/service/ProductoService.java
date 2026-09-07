package com.lsvf.backend.service;

import com.lsvf.backend.dtos.producto.ProductoRequest;
import com.lsvf.backend.dtos.producto.ProductoResponse;

import java.util.List;

public interface ProductoService {
    List<ProductoResponse> allProductos();
    List<ProductoResponse> productosDisponibles();
    ProductoResponse productoPorId(Long id);
    ProductoResponse productoCreado(ProductoRequest productoRequest);
    void desactivarProducto(Long id);
    void activarProducto(Long id);
}
