package com.lsvf.backend.service.reservamesa;

import com.lsvf.backend.dtos.reserva_mesa.MesaRequest;
import com.lsvf.backend.dtos.reserva_mesa.MesaResponse;
import com.lsvf.backend.entities.Mesa;
import com.lsvf.backend.enums.mesa.EstadoMesa;
import com.lsvf.backend.mappers.ReservaMesaMapper;
import com.lsvf.backend.repository.MesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaServiceImpl implements MesaService{

    private final ReservaMesaMapper reservaMesaMapper;

    private final MesaRepository mesaRepository;

    public MesaServiceImpl(ReservaMesaMapper reservaMesaMapper, MesaRepository mesaRepository) {
        this.reservaMesaMapper = reservaMesaMapper;
        this.mesaRepository = mesaRepository;
    }

    @Override
    public MesaResponse crearMesa(MesaRequest request) {

        Mesa mesa = reservaMesaMapper.toEntityMesa(request);

        mesaRepository.save(mesa);

        return reservaMesaMapper.toResponseMesa(mesa);
    }

    @Override
    public List<MesaResponse> listarMesas() {

        return mesaRepository.findAll().stream().map(reservaMesaMapper::toResponseMesa).toList();
    }

    @Override
    public List<MesaResponse> listarMesasDisponibles() {

        return mesaRepository.findByEstadoMesa(EstadoMesa.DISPONIBLE).stream().map(reservaMesaMapper::toResponseMesa).toList();
    }
}
