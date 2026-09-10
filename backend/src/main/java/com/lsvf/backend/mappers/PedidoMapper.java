package com.lsvf.backend.mappers;

import com.lsvf.backend.dtos.items_pedidos.ItemPedidoRequest;
import com.lsvf.backend.dtos.items_pedidos.ItemPedidoResponse;
import com.lsvf.backend.dtos.items_pedidos.PedidoRequest;
import com.lsvf.backend.dtos.items_pedidos.PedidoResponse;
import com.lsvf.backend.entities.ItemPedido;
import com.lsvf.backend.entities.Pedido;
import com.lsvf.backend.entities.Producto;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.repository.PedidoRepository;
import com.lsvf.backend.repository.ProductoRepository;
import com.lsvf.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class PedidoMapper {

    public PedidoResponse toResponse(Pedido pedido) {
        PedidoResponse response = new PedidoResponse();
        response.setId(pedido.getId());
        response.setFecha(pedido.getFecha());
        response.setTipoPedido(pedido.getTipoPedido());
        response.setDireccion(pedido.getDireccion());
        response.setEstadoPedido(pedido.getEstadoPedido());
        response.setMetodoPago(pedido.getMetodoPago());
        response.setTotal(pedido.getTotal());
        response.setItems(pedido.getItems().stream().map(this::toItemResponse).toList());
        return response;
    }

    private ItemPedidoResponse toItemResponse(ItemPedido item) {
        return new ItemPedidoResponse(
                item.getProducto().getId(),
                item.getProducto().getNombre(),
                item.getCantidad(),
                item.getPrecioUnitario(),
                item.getSubtotal()
        );
    }
}
