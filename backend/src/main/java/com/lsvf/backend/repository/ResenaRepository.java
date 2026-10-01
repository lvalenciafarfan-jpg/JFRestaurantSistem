package com.lsvf.backend.repository;

import com.lsvf.backend.entities.Resena;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    boolean existsByUsuarioId(Long usuarioId);

    Page<Resena> findAll(Pageable pageable);

    @Query("SELECT AVG(r.calificacion) FROM Resena r")
    BigDecimal promedio();
}
