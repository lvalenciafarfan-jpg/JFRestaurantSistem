package com.lsvf.backend.service.reservamesa;

import com.lsvf.backend.dtos.reserva_mesa.ReservaRequest;
import com.lsvf.backend.dtos.reserva_mesa.ReservaResponse;
import com.lsvf.backend.entities.Mesa;
import com.lsvf.backend.entities.Reserva;
import com.lsvf.backend.entities.Usuario;
import com.lsvf.backend.enums.mesa.EstadoMesa;
import com.lsvf.backend.enums.mesa.EstadoReserva;
import com.lsvf.backend.exception.customs.AccesoDenegadoException;
import com.lsvf.backend.exception.customs.RecursoNoEncontradoException;
import com.lsvf.backend.exception.customs.ReglaDeNegocioException;
import com.lsvf.backend.mappers.ReservaMesaMapper;
import com.lsvf.backend.repository.MesaRepository;
import com.lsvf.backend.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaServiceImpl implements ReservaService{

    private final ReservaRepository reservaRepository;

    private final ReservaMesaMapper reservaMesaMapper;

    private final MesaRepository mesaRepository;

    public ReservaServiceImpl(ReservaRepository reservaRepository, ReservaMesaMapper reservaMesaMapper, MesaRepository mesaRepository) {
        this.reservaRepository = reservaRepository;
        this.reservaMesaMapper = reservaMesaMapper;
        this.mesaRepository = mesaRepository;
    }

    @Override
    public List<ReservaResponse> listarTodasLasReservas(LocalDateTime desde, LocalDateTime hasta) {
        List<Reserva> reservas = (desde != null && hasta != null)
                ? reservaRepository.findByHoraInicioBetween(desde, hasta)
                : reservaRepository.findAll();

        return reservas.stream().map(reservaMesaMapper::toResponseReserva).toList();
    }

    @Override
    public ReservaResponse crearReserva(ReservaRequest request, Usuario usuario) {

        if(request.getHoraInicio().isAfter(request.getHoraFin())){
            throw new ReglaDeNegocioException("La hora de fin debe ser posterior a la hora de inicio. ");
        }

        List<Reserva> reservasSolapadas = reservaRepository.findReservasSolapadas(request.getId_mesa(), request.getHoraInicio(), request.getHoraFin());

        if(!reservasSolapadas.isEmpty()){
            throw new ReglaDeNegocioException("La mesa ya esta reservada en ese horario");
        }

        Reserva reserva = reservaMesaMapper.toEntityReserva(request);
        reserva.setUsuario(usuario);

        Mesa mesa = reserva.getMesa();

        mesa.setEstado(EstadoMesa.RESERVADA);

        mesaRepository.save(mesa);

        return reservaMesaMapper.toResponseReserva(reserva);
    }

    @Override
    public ReservaResponse listarReservaId(Usuario usuario, Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Esta reserva no existe."));

        if (!reserva.getUsuario().getId().equals(usuario.getId())){
            throw new AccesoDenegadoException("Esta reserva no es tuya!");
        }

        return reservaMesaMapper.toResponseReserva(reserva);
    }

    @Override
    public List<ReservaResponse> listarReservas(Usuario usuario) {

        return reservaRepository.findByUsuario(usuario).stream().map(reservaMesaMapper::toResponseReserva).toList();
    }


    @Override
    public ReservaResponse cambiarEstadoReserva(EstadoReserva estadoReserva, Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Esta reserva no existe."));

        validarTransicion(reserva.getEstadoReserva(), estadoReserva);

        reserva.setEstadoReserva(estadoReserva);

        if(estadoReserva == EstadoReserva.CANCELADA || estadoReserva == EstadoReserva.NO_SHOW){
            reserva.getMesa().setEstado(EstadoMesa.DISPONIBLE);
            mesaRepository.save(reserva.getMesa());
        }

        reservaRepository.save(reserva);

        return reservaMesaMapper.toResponseReserva(reserva);
    }

    @Override
    public ReservaResponse cancelarReserva(Usuario usuario, Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Esta reserva no existe."));

        if (!reserva.getUsuario().getId().equals(usuario.getId())){
            throw new AccesoDenegadoException("Esta reserva no es tuya!");
        }

        validarTransicion(reserva.getEstadoReserva(), EstadoReserva.CANCELADA);

        reserva.setEstadoReserva(EstadoReserva.CANCELADA);
        reserva.getMesa().setEstado(EstadoMesa.DISPONIBLE);

        reservaRepository.save(reserva);
        mesaRepository.save(reserva.getMesa());

        return reservaMesaMapper.toResponseReserva(reserva);

    }

    public void validarTransicion(EstadoReserva actual, EstadoReserva estadoNuevo){
        Boolean valido = switch (actual){
            case PENDIENTE -> estadoNuevo == EstadoReserva.CANCELADA || estadoNuevo == EstadoReserva.CONFIRMADA;
            case CONFIRMADA -> estadoNuevo == EstadoReserva.COMPLETADA || estadoNuevo == EstadoReserva.NO_SHOW;
            case NO_SHOW -> estadoNuevo == EstadoReserva.CANCELADA;
            case CANCELADA, COMPLETADA -> false;
        };

        if(!valido){
            throw new ReglaDeNegocioException("Transicion de estado invalida: de " + actual + "a "  + estadoNuevo);
        }
    }
}
