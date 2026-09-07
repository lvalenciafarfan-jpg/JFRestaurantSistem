package com.lsvf.backend.entities;

import com.lsvf.backend.enums.DisponibilidadProducto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private String urlImagen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisponibilidadProducto disponibilidad;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private CategoriaProducto categoriaProducto;
}
