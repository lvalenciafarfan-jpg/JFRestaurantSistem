package com.lsvf.backend.repository;

import com.lsvf.backend.entities.Reserva;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.mesa.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuario(Usuario usuario);

    List<Reserva> findByEstadoReservaAndHoraFinBefore(EstadoReserva estado, LocalDateTime fecha);

    List<Reserva> findByHoraInicioBetween(LocalDateTime desde, LocalDateTime hasta);

    @Query("SELECT r FROM Reserva r WHERE r.mesa.id = :mesaId " +
            "AND r.estadoReserva IN ('PENDIENTE', 'CONFIRMADA') " +
            "AND r.horaInicio < :horaFin AND r.horaFin > :horaInicio")
    List<Reserva> findReservasSolapadas(@Param("mesaId") Long mesaId,
                                        @Param("horaInicio") LocalDateTime horaInicio,
                                        @Param("horaFin") LocalDateTime horaFin);

}
