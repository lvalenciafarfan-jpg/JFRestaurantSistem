package com.lsvf.backend.dtos.producto;

import com.lsvf.backend.enums.DisponibilidadProducto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class ProductoRequest {

    @NotBlank(message = "El nombre es obligatorio.")
    @Length(max = 50, min = 5)
    private String nombre;

    @NotBlank(message = "La descripcion es obligatoria.")
    @Length(max = 255, min = 10)
    private String descripcion;

    @NotNull(message = "El precio es obligatorio.")
    private BigDecimal precio;

    @NotBlank(message = "La url de la imagen es obligaoria")
    private String urlImagen;

    @NotBlank(message = "La disponibilidad es obligatoria.")
    private DisponibilidadProducto disponibilidadProducto;

    @NotBlank(message = "Es obligatorio el id de la categoria del producto")
    private Long categoriaId;
}
