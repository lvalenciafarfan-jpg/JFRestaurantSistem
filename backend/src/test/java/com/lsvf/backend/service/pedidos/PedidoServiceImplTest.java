package com.lsvf.backend.service.pedidos;

import com.lsvf.backend.enums.pedido.EstadoPedido;
import com.lsvf.backend.exception.customs.ReglaDeNegocioException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PedidoServiceImplTest {

    private final PedidoServiceImpl pedidoService = new PedidoServiceImpl(null, null, null);

    @Test
    void deberiaPermitirTransicionDePendienteAEnPreparacion() {
        assertDoesNotThrow(() ->
                pedidoService.validarTransicion(EstadoPedido.PENDIENTE, EstadoPedido.EN_PREPARACION));
    }

    @Test
    void deberiaPermitirTransicionDeEnPreparacionAEnCamino(){
        assertDoesNotThrow(() -> pedidoService.validarTransicion(EstadoPedido.EN_PREPARACION, EstadoPedido.EN_CAMINO));
    }

    @Test
    void noDeberiaPermitirTransicionDeEnPreparacionAEnPendiente(){
        assertThrows(ReglaDeNegocioException.class, () -> pedidoService.validarTransicion(EstadoPedido.EN_PREPARACION, EstadoPedido.PENDIENTE));
    }

    @Test
    void noDeberiaPermitirTransicionDeEnCaminoAEnPreparacion(){
        assertThrows(ReglaDeNegocioException.class, () ->
                pedidoService.validarTransicion(EstadoPedido.EN_CAMINO, EstadoPedido.EN_PREPARACION));
    }
}