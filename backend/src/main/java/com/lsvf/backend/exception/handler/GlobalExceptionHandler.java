package com.lsvf.backend.exception.handler;

import com.lsvf.backend.exception.customs.AccesoDenegadoException;
import com.lsvf.backend.exception.customs.CredencialesInvalidasException;
import com.lsvf.backend.exception.customs.RecursoNoEncontradoException;
import com.lsvf.backend.exception.customs.ReglaDeNegocioException;
import com.lsvf.backend.exception.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> RecursoNotEncontrado(RecursoNoEncontradoException ex){
        ErrorResponse error = new ErrorResponse(404, ex.getMessage(), LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ReglaDeNegocioException.class)
    public ResponseEntity<ErrorResponse> ReglaDeNegocioException(ReglaDeNegocioException ex){
        ErrorResponse error = new ErrorResponse(400, ex.getMessage(), LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ErrorResponse> CredencialesInvalidasException(CredencialesInvalidasException ex){
        ErrorResponse error = new ErrorResponse(401, ex.getMessage(), LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<ErrorResponse> AccesoDenegadoException(AccesoDenegadoException ex){
        ErrorResponse error =  new ErrorResponse(403, ex.getMessage(), LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

}

