package com.lsvf.backend.dtos.resena;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class ResenaRequest {

    @NotNull(message = "la calificacion es obligatoria")
    @Min(1)
    @Max(5)
    private Integer calificacion;

    @NotNull(message = "El comentario es obligatorio.")
    @Length(min = 5, max = 100)
    private String comentario;
}
