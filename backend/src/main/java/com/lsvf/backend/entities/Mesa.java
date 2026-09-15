package com.lsvf.backend.entities;

import com.lsvf.backend.enums.mesa.EstadoMesa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numeroMesa;

    @Column(nullable = false)
    private Long capacidad;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoMesa estado;

    @OneToMany(mappedBy = "mesa")
    private List<Reserva> reservas;
}
