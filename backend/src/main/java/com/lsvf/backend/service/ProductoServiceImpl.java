package com.lsvf.backend.service;

import com.lsvf.backend.dtos.producto.ProductoRequest;
import com.lsvf.backend.dtos.producto.ProductoResponse;
import com.lsvf.backend.entities.CategoriaProducto;
import com.lsvf.backend.entities.Producto;
import com.lsvf.backend.enums.DisponibilidadProducto;
import com.lsvf.backend.mappers.ProductoMapper;
import com.lsvf.backend.repository.CategoriaProductoRepository;
import com.lsvf.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService{

    private final ProductoRepository productoRepository;

    private final ProductoMapper productoMapper;

    private final CategoriaProductoRepository categoriaProductoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository, ProductoMapper productoMapper, CategoriaProductoRepository categoriaProductoRepository){
        this.productoRepository = productoRepository;
        this.productoMapper = productoMapper;
        this.categoriaProductoRepository = categoriaProductoRepository;
    }

    public Producto encontrarProducto(Long id){
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id " + id));
    }

    public CategoriaProducto encontrarCategoriaP(Long id){
        return categoriaProductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("La categoria del producto con " + id + " no existe."));
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
    public ProductoResponse actualizarProducto(Long id, ProductoRequest request) {
        Producto producto = encontrarProducto(id);

        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setDescripcion(request.getDescripcion());
        producto.setUrlImagen(request.getUrlImagen());
        producto.setDisponibilidad(request.getDisponibilidadProducto());

        CategoriaProducto categoriaProducto = encontrarCategoriaP(id);

        producto.setCategoriaProducto(categoriaProducto);

        productoRepository.save(producto);

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
