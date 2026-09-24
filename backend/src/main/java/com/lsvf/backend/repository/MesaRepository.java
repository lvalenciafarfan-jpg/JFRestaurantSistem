package com.lsvf.backend.repository;

import com.lsvf.backend.entities.Mesa;
import com.lsvf.backend.enums.mesa.EstadoMesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    List<Mesa> findByEstado(EstadoMesa estadoMesa);
}
