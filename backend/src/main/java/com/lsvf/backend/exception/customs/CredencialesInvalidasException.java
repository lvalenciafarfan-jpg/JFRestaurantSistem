package com.lsvf.backend.exception.customs;

public class CredencialesInvalidasException extends RuntimeException{
    public CredencialesInvalidasException(String mensaje ){
        super(mensaje);
    }
}
