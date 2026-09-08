package com.lsvf.backend.controller;


import com.lsvf.backend.dtos.categoria.CategoriaRequest;
import com.lsvf.backend.dtos.categoria.CategoriaResponse;
import com.lsvf.backend.dtos.producto.ProductoRequest;
import com.lsvf.backend.dtos.producto.ProductoResponse;
import com.lsvf.backend.service.categoriaproducto.CategoriaService;
import com.lsvf.backend.service.producto.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MenuProductosController {

    private final ProductoService productoService;

    private final CategoriaService categoriaService;

    public MenuProductosController(ProductoService productoService, CategoriaService categoriaService) {
        this.productoService = productoService;
        this.categoriaService = categoriaService;
    }

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponse>> productosDisponibles(){
        return ResponseEntity.ok().body(productoService.productosDisponibles());
    }

    @GetMapping("/producto/{id}")
    public ResponseEntity<ProductoResponse> productoPorId(@PathVariable Long id){
        return ResponseEntity.ok().body(productoService.productoPorId(id));
    }

    @GetMapping("/categorias")
    public  ResponseEntity<List<CategoriaResponse>> allCategorias(){
        return ResponseEntity.ok().body(categoriaService.allCategorias());
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaResponse> crearCategoria(@RequestBody CategoriaRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crearCategoria(request));
    }

    @PostMapping("/productos")
    public ResponseEntity<ProductoResponse> crearProducto(@RequestBody ProductoRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.productoCreado(request));
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<ProductoResponse> actualizarProducto(@RequestBody ProductoRequest request, @PathVariable Long id){
        return ResponseEntity.ok().body(productoService.actualizarProducto(id, request));
    }

}
