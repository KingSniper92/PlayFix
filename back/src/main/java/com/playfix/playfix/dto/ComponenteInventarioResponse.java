package com.playfix.playfix.dto;

public class ComponenteInventarioResponse {

    private Long idParte;
    private String nombreParte;
    private Integer cantidadParte;
    private String fabricante;   // nombre fabricante
    private String referencia;   // referencia dispositivo

    public ComponenteInventarioResponse(Long idParte, String nombreParte, Integer cantidadParte, String fabricante, String referencia) {
        this.idParte = idParte;
        this.nombreParte = nombreParte;
        this.cantidadParte = cantidadParte;
        this.fabricante = fabricante;
        this.referencia = referencia;
    }

    // Getters y Setters
    public Long getIdParte() {
        return idParte;
    }

    public void setIdParte(Long idParte) {
        this.idParte = idParte;
    }

    public String getNombreParte() {
        return nombreParte;
    }

    public void setNombreParte(String nombreParte) {
        this.nombreParte = nombreParte;
    }

    public Integer getCantidadParte() {
        return cantidadParte;
    }

    public void setCantidadParte(Integer cantidadParte) {
        this.cantidadParte = cantidadParte;
    }

    public String getFabricante() {
        return fabricante;
    }

    public void setFabricante(String fabricante) {
        this.fabricante = fabricante;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }
}