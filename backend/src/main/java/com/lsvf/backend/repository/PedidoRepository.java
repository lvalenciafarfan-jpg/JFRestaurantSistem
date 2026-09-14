package com.lsvf.backend.repository;

import com.lsvf.backend.entities.Pedido;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.pedido.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(Usuario usuario);
    List<Pedido> findByEstadoPedido(EstadoPedido estado);
}
