package com.lsvf.backend.dtos.resena;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResenaResponse {

    private Long id;

    private String nombreUsuario;

    private Integer calificacion;

    private String comentario;

    private LocalDateTime fecha;
}
