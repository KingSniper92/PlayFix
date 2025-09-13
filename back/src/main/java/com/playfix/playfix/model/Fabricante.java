package com.playfix.playfix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fabricantes")
public class Fabricante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_fabricante")
    private Long idFabricante;

    @Column(name = "nombre_fabricante", nullable = false)
    private String nombreFabricante;

    @Column(name = "web_fabricante")
    private String webFabricante;

    // Getters y Setters
    public Long getIdFabricante() {
        return idFabricante;
    }

    public void setIdFabricante(Long idFabricante) {
        this.idFabricante = idFabricante;
    }

    public String getNombreFabricante() {
        return nombreFabricante;
    }

    public void setNombreFabricante(String nombreFabricante) {
        this.nombreFabricante = nombreFabricante;
    }

    public String getWebFabricante() {
        return webFabricante;
    }

    public void setWebFabricante(String webFabricante) {
        this.webFabricante = webFabricante;
    }
}