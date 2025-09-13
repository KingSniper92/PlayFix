package com.playfix.playfix.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente {

    // ==== getters y setters ====

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    @JsonProperty("id_cliente")
    private Long idCliente;

    @Column(name = "nombre_cliente", nullable = false)
    @JsonProperty("nombre_cliente")
    private String nombreCliente;

    @Column(name = "direccion_cliente")
    @JsonProperty("direccion_cliente")
    private String direccionCliente;

    @Column(name = "telefono_cliente")
    @JsonProperty("telefono_cliente")
    private String telefonoCliente;

    @Column(name = "correo_cliente")
    @JsonProperty("correo_cliente")
    private String correoCliente;

    // ==== getters y setters ====
    @JsonProperty("id_cliente")
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

    @JsonProperty("nombre_cliente")
    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }

    @JsonProperty("direccion_cliente")
    public String getDireccionCliente() { return direccionCliente; }
    public void setDireccionCliente(String direccionCliente) { this.direccionCliente = direccionCliente; }

    @JsonProperty("telefono_cliente")
    public String getTelefonoCliente() { return telefonoCliente; }
    public void setTelefonoCliente(String telefonoCliente) { this.telefonoCliente = telefonoCliente; }

    @JsonProperty("correo_cliente")
    public String getCorreoCliente() { return correoCliente; }
    public void setCorreoCliente(String correoCliente) { this.correoCliente = correoCliente; }
}