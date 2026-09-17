package com.lsvf.backend.service.reservamesa;

import com.lsvf.backend.dtos.reserva_mesa.MesaRequest;
import com.lsvf.backend.dtos.reserva_mesa.MesaResponse;

import java.util.List;

public interface MesaService {
    MesaResponse crearMesa(MesaRequest request);
    List<MesaResponse> listarMesas();
    List<MesaResponse> listarMesasDisponibles();
}
