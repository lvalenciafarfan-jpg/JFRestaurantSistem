package com.lsvf.backend.dtos.producto;

import com.lsvf.backend.enums.DisponibilidadProducto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoResponse {

    private String nombre;

    private String descripcion;

    private BigDecimal precio;

    private String urlImagen;

    private DisponibilidadProducto disponibilidadProducto;
}
