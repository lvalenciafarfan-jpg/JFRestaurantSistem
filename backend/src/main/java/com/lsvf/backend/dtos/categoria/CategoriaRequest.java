package com.lsvf.backend.dtos.categoria;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
public class CategoriaRequest {

    @NotNull(message = "El nombre de la categoria del producto no puede estar vacia.")
    @Length(min = 3, max = 30, message = "Los caracteres minimos del nombre son 3 y maximo 30.")
    private String nombre;
}
