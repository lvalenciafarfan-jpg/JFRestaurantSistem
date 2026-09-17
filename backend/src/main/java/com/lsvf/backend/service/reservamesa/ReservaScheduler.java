package com.lsvf.backend.service.reservamesa;

import com.lsvf.backend.entities.Reserva;
import com.lsvf.backend.enums.mesa.EstadoMesa;
import com.lsvf.backend.enums.mesa.EstadoReserva;
import com.lsvf.backend.repository.MesaRepository;
import com.lsvf.backend.repository.ReservaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaScheduler {

    private final ReservaRepository reservaRepository;
    private final MesaRepository mesaRepository;

    public ReservaScheduler(ReservaRepository reservaRepository, MesaRepository mesaRepository) {
        this.reservaRepository = reservaRepository;
        this.mesaRepository = mesaRepository;
    }

    @Scheduled(fixedRate = 300000) // cada 5 minutos
    public void liberarMesasDeReservasVencidas() {
        List<Reserva> vencidas = reservaRepository
                .findByEstadoReservaAndHoraFinBefore(EstadoReserva.CONFIRMADA, LocalDateTime.now());

        for (Reserva reserva : vencidas) {
            reserva.setEstadoReserva(EstadoReserva.COMPLETADA);
            reserva.getMesa().setEstado(EstadoMesa.DISPONIBLE);

            reservaRepository.save(reserva);
            mesaRepository.save(reserva.getMesa());
        }
    }
}
