package com.lsvf.backend.dtos.items_pedidos;

import com.lsvf.backend.enums.pedido.EstadoPedido;
import com.lsvf.backend.enums.pedido.MetodoPago;
import com.lsvf.backend.enums.pedido.TipoPedido;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoResponse {

    private Long id;

    private LocalDateTime fecha;

    private TipoPedido tipoPedido;

    private String direccion;

    private EstadoPedido estadoPedido;

    private MetodoPago metodoPago;

    private BigDecimal total;

    private List<ItemPedidoResponse> items;
}
