package com.playfix.playfix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "componentes")
public class Componente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_parte")
    private Long idParte;

    @Column(name = "nombre_parte", nullable = false)
    private String nombreParte;

    @Column(name = "cantidad_parte", nullable = false)
    private Integer cantidadParte;

    // Relaciones con Fabricante y Referencia
    @ManyToOne
    @JoinColumn(name = "id_fabricante", nullable = false)
    private Fabricante fabricante;

    @ManyToOne
    @JoinColumn(name = "id_referencia", nullable = false)
    private Referencia referencia;

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

    public Fabricante getFabricante() {
        return fabricante;
    }

    public void setFabricante(Fabricante fabricante) {
        this.fabricante = fabricante;
    }

    public Referencia getReferencia() {
        return referencia;
    }

    public void setReferencia(Referencia referencia) {
        this.referencia = referencia;
    }
}