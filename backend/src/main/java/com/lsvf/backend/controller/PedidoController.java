package com.lsvf.backend.controller;

import com.lsvf.backend.dtos.items_pedidos.PedidoRequest;
import com.lsvf.backend.dtos.items_pedidos.PedidoResponse;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.pedido.EstadoPedido;
import com.lsvf.backend.service.pedidos.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService){
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> crearPedido(
            @Valid @RequestBody PedidoRequest request,
            @AuthenticationPrincipal Usuario usuario) {

        PedidoResponse response = pedidoService.crearPedido(request, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mios")
    public ResponseEntity<List<PedidoResponse>> misPedidos(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(pedidoService.misPedidos(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> pedidoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.pedidoPorId(id));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<PedidoResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoPedido nuevoEstado) {

        return ResponseEntity.ok(pedidoService.cambiarEstado(id, nuevoEstado));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PedidoResponse> cancelarPedido(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {

        return ResponseEntity.ok(pedidoService.cancelarPedido(id, usuario));
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listarTodos(
            @RequestParam(required = false) EstadoPedido estado) {

        return ResponseEntity.ok(pedidoService.listarTodos(estado));
    }
}
