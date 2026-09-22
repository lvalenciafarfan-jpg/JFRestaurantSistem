package com.lsvf.backend.exception.customs;

public class ReglaDeNegocioException extends RuntimeException{
    public ReglaDeNegocioException(String mensaje){
        super(mensaje);
    }
}
