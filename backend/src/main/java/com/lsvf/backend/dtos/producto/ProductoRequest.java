package com.lsvf.backend.dtos.producto;

import com.lsvf.backend.enums.DisponibilidadProducto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class ProductoRequest {

    private String nombre;

    private String descripcion;

    private BigDecimal precio;

    private String urlImagen;

    private DisponibilidadProducto disponibilidadProducto;
}
