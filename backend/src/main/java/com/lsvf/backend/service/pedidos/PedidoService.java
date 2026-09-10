package com.lsvf.backend.service.pedidos;

import com.lsvf.backend.dtos.items_pedidos.PedidoRequest;
import com.lsvf.backend.dtos.items_pedidos.PedidoResponse;
import com.lsvf.backend.entities.Usuario;

import java.util.List;

public interface PedidoService {
    PedidoResponse crearPedido(PedidoRequest request, Usuario usuario);
    PedidoResponse pedidoPorId(Long id);
    List<PedidoResponse> misPedidos(Usuario usuario);
}
