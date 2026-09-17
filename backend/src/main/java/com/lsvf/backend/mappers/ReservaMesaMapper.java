package com.lsvf.backend.mappers;

import com.lsvf.backend.dtos.reserva_mesa.MesaRequest;
import com.lsvf.backend.dtos.reserva_mesa.MesaResponse;
import com.lsvf.backend.dtos.reserva_mesa.ReservaRequest;
import com.lsvf.backend.dtos.reserva_mesa.ReservaResponse;
import com.lsvf.backend.entities.Mesa;
import com.lsvf.backend.entities.Reserva;
import com.lsvf.backend.enums.mesa.EstadoMesa;
import com.lsvf.backend.enums.mesa.EstadoReserva;
import com.lsvf.backend.repository.MesaRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ReservaMesaMapper {

    private final MesaRepository mesaRepository;

    public ReservaMesaMapper(MesaRepository mesaRepository) {
        this.mesaRepository = mesaRepository;
    }

    public Reserva toEntityReserva(ReservaRequest request){

        Reserva reserva = new Reserva();

        reserva.setEstadoReserva(EstadoReserva.PENDIENTE);
        reserva.setHoraInicio(request.getHoraInicio());
        reserva.setHoraFin(request.getHoraFin());
        reserva.setCantidadPersonas(request.getCantidadPersonas());

        Mesa mesa = mesaRepository.findById(request.getId_mesa())
                        .orElseThrow(() -> new RuntimeException("El id de la mesa no existe."));

        reserva.setMesa(mesa);

        return reserva;
    }

    public ReservaResponse toResponseReserva(Reserva reserva){

        ReservaResponse reservaResponse = new ReservaResponse();

        reservaResponse.setEstadoReserva(reserva.getEstadoReserva());
        reservaResponse.setId(reserva.getId());
        reservaResponse.setHoraInicio(reserva.getHoraInicio());
        reserva.setHoraFin(reserva.getHoraFin());
        reservaResponse.setCantidadPersonas(reserva.getCantidadPersonas());

        MesaResponse mesaResponse = toResponseMesa(reserva.getMesa());

        reservaResponse.setMesaResponse(mesaResponse);

        return reservaResponse;
    }

    public Mesa toEntityMesa(MesaRequest request){
        Mesa mesa = new Mesa();
        mesa.setCapacidad(request.getCapacidad());
        mesa.setNumeroMesa(request.getNumeroMesa());
        mesa.setEstado(EstadoMesa.DISPONIBLE);

        return mesa;
    }

    public MesaResponse toResponseMesa(Mesa mesa){
        MesaResponse mesaResponse = new MesaResponse();
        mesaResponse.setCapacidad(mesa.getCapacidad());
        mesaResponse.setEstadoMesa(mesa.getEstado());
        mesaResponse.setId(mesa.getId());
        mesaResponse.setNumeroMesa(mesa.getNumeroMesa());

        return mesaResponse;
    }
}
