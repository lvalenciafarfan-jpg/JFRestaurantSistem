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

    @Override
    public PedidoResponse cancelarPedido(Long id, Usuario usuario) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("El pedido no existe con id: " + id));

        if(!pedido.getUsuario().getId().equals(usuario.getId())){
            throw new RuntimeException("No puedes cancelar un pedido que no es tuyo.");
        }

        if(pedido.getEstadoPedido() != EstadoPedido.PENDIENTE){
            throw new RuntimeException("No se puede cancelar un pedido que no esta pendiente.");
        }

        pedido.setEstadoPedido(EstadoPedido.CANCELADO);
        pedidoRepository.save(pedido);

        return pedidoMapper.toResponse(pedido);
    }

    @Override
    public PedidoResponse cambiarEstado(Long id, EstadoPedido estadoNuevo){
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("El pedido no existe con id: " + id));

        validarTransicion(pedido.getEstadoPedido(), estadoNuevo);

        pedido.setEstadoPedido(estadoNuevo);
        pedidoRepository.save(pedido);

        return pedidoMapper.toResponse(pedido);
    }

    @Override
    public List<PedidoResponse> listarTodos(EstadoPedido estado){
        List<Pedido> pedidos = (estado != null) ? pedidoRepository.findByEstadoPedido(estado)
                : pedidoRepository.findAll();

        return pedidos.stream().map(pedidoMapper::toResponse).toList();
    }


    public void validarTransicion(EstadoPedido actual, EstadoPedido cambioEstado){

        Boolean valido = switch (actual){
            case PENDIENTE -> cambioEstado == EstadoPedido.EN_PREPARACION || cambioEstado == EstadoPedido.CANCELADO;
            case EN_PREPARACION -> cambioEstado == EstadoPedido.EN_CAMINO || cambioEstado == EstadoPedido.ENTREGADO;
            case EN_CAMINO -> cambioEstado == EstadoPedido.ENTREGADO;
            case ENTREGADO, CANCELADO -> false;
        };

        if(!valido){
            throw new RuntimeException("Transicion de estado invalida: de " + actual + "a "  + cambioEstado);
        }
    }

}
