package com.lsvf.backend.dtos.reserva_mesa;

import com.lsvf.backend.enums.mesa.EstadoMesa;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MesaResponse {

    private Long id;

    private Integer numeroMesa;

    private Integer capacidad;

    private EstadoMesa estadoMesa;
}
