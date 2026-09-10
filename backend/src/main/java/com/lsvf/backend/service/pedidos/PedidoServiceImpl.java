package com.lsvf.backend.service.pedidos;

import com.lsvf.backend.dtos.items_pedidos.ItemPedidoRequest;
import com.lsvf.backend.dtos.items_pedidos.PedidoRequest;
import com.lsvf.backend.dtos.items_pedidos.PedidoResponse;
import com.lsvf.backend.entities.ItemPedido;
import com.lsvf.backend.entities.Pedido;
import com.lsvf.backend.entities.Producto;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.pedido.EstadoPedido;
import com.lsvf.backend.enums.pedido.TipoPedido;
import com.lsvf.backend.mappers.PedidoMapper;
import com.lsvf.backend.repository.PedidoRepository;
import com.lsvf.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final PedidoMapper pedidoMapper;

    public PedidoServiceImpl(PedidoRepository pedidoRepository,
                             ProductoRepository productoRepository,
                             PedidoMapper pedidoMapper) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.pedidoMapper = pedidoMapper;
    }

    @Override
    public PedidoResponse crearPedido(PedidoRequest request, Usuario usuario) {

        if (request.getTipoPedido() == TipoPedido.A_DOMICILIO
                && (request.getDireccion() == null || request.getDireccion().isBlank())) {
            throw new RuntimeException("La direccion es obligatoria para pedidos a domicilio");
        }

        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDateTime.now());
        pedido.setTipoPedido(request.getTipoPedido());
        pedido.setDireccion(request.getDireccion());
        pedido.setMetodoPago(request.getMetodoPago());
        pedido.setEstadoPedido(EstadoPedido.PENDIENTE);
        pedido.setUsuario(usuario);

        List<ItemPedido> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoRequest itemRequest : request.getItems()) {
            Producto producto = productoRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException(
                            "Producto no encontrado con id " + itemRequest.getProductoId()));

            BigDecimal precioUnitario = producto.getPrecio(); // se "congela" aqui
            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(itemRequest.getCantidad()));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProducto(producto);
            item.setCantidad(itemRequest.getCantidad());
            item.setPrecioUnitario(precioUnitario);
            item.setSubtotal(subtotal);

            items.add(item);
            total = total.add(subtotal);
        }

        pedido.setItems(items);
        pedido.setTotal(total);

        pedidoRepository.save(pedido);

        return pedidoMapper.toResponse(pedido);
    }

    @Override
    public PedidoResponse pedidoPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id " + id));
        return pedidoMapper.toResponse(pedido);
    }

    @Override
    public List<PedidoResponse> misPedidos(Usuario usuario) {
        return pedidoRepository.findByUsuario(usuario)
                .stream()
                .map(pedidoMapper::toResponse)
                .toList();
    }
}
