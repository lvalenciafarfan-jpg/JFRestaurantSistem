package com.lsvf.backend.exception.customs;

public class AccesoDenegadoException extends RuntimeException{
    public AccesoDenegadoException(String mensaje){
        super(mensaje);
    }
}
