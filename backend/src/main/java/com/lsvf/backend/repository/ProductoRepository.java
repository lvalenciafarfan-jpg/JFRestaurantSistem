package com.lsvf.backend.repository;

import com.lsvf.backend.entities.Producto;
import com.lsvf.backend.enums.producto.DisponibilidadProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByDisponibilidad(DisponibilidadProducto disponibilidad);

}
