package com.lsvf.backend.dtos.items_pedidos;

import com.lsvf.backend.enums.pedido.MetodoPago;
import com.lsvf.backend.enums.pedido.TipoPedido;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class PedidoRequest {

    @NotNull(message = "El tipo de pedido es obligatorio")
    private TipoPedido tipoPedido;

    private String direccion; // obligatoria solo si tipoPedido es A_DOMICILIO, se valida en el service

    @NotNull(message = "El metodo de pago es obligatorio")
    private MetodoPago metodoPago;

    @NotEmpty(message = "El pedido debe tener al menos un producto")
    @Valid
    private List<ItemPedidoRequest> items;


}
