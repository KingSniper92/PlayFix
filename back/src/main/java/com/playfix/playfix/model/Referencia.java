package com.playfix.playfix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "referencias")
public class Referencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_referencia;

    @Column(nullable = false, unique = true)
    private String referencia_dispositivo;

    // Getters y setters
    public Long getId_referencia() {
        return id_referencia;
    }

    public void setId_referencia(Long id_referencia) {
        this.id_referencia = id_referencia;
    }

    public String getReferencia_dispositivo() {
        return referencia_dispositivo;
    }

    public void setReferencia_dispositivo(String referencia_dispositivo) {
        this.referencia_dispositivo = referencia_dispositivo;
    }
}