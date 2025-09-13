package com.playfix.playfix.service;

import com.playfix.playfix.model.Orden;
import com.playfix.playfix.repository.OrdenRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdenService {

    private final OrdenRepository ordenRepository;

    public OrdenService(OrdenRepository ordenRepository) {
        this.ordenRepository = ordenRepository;
    }

    // Listar todas las órdenes
    public List<Orden> listarOrdenes() {
        return ordenRepository.findAll();
    }

    // Crear una nueva orden
    public Orden guardarOrden(Orden orden) {
        return ordenRepository.save(orden);
    }

    // Actualizar orden
    public Orden actualizarOrden(Long id, Orden orden) {
        Orden existente = ordenRepository.findById(id).orElseThrow();
        existente.setNumeroSerie(orden.getNumeroSerie());
        existente.setCliente(orden.getCliente());
        existente.setReferencia(orden.getReferencia());
        existente.setEstado(orden.getEstado());
        existente.setFechaIngreso(orden.getFechaIngreso());
        existente.setFechaCotizacion(orden.getFechaCotizacion());
        existente.setFechaAprobacion(orden.getFechaAprobacion());
        existente.setFechaFinalizacion(orden.getFechaFinalizacion());
        existente.setObservaciones(orden.getObservaciones());
        return ordenRepository.save(existente);
    }

    // Eliminar orden
    public void eliminarOrden(Long id) {
        ordenRepository.deleteById(id);
    }
}