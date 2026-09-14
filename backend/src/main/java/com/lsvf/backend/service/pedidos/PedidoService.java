package com.lsvf.backend.service.pedidos;

import com.lsvf.backend.dtos.items_pedidos.PedidoRequest;
import com.lsvf.backend.dtos.items_pedidos.PedidoResponse;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.pedido.EstadoPedido;

import java.util.List;

public interface PedidoService {
    PedidoResponse crearPedido(PedidoRequest request, Usuario usuario);
    PedidoResponse pedidoPorId(Long id);
    List<PedidoResponse> misPedidos(Usuario usuario);
    PedidoResponse cancelarPedido(Long id, Usuario usuario);
    PedidoResponse cambiarEstado(Long id, EstadoPedido estadoNuevo);
    List<PedidoResponse> listarTodos(EstadoPedido estado);
}
