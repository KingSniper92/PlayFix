package com.playfix.playfix.service;

import com.playfix.playfix.dto.ComponenteInventarioResponse;
import com.playfix.playfix.model.Componente;
import com.playfix.playfix.repository.ComponenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComponenteService {

    private final ComponenteRepository componenteRepository;

    public ComponenteService(ComponenteRepository componenteRepository) {
        this.componenteRepository = componenteRepository;
    }

    public List<ComponenteInventarioResponse> listarComponentes() {
        return componenteRepository.findAll().stream()
                .map(c -> new ComponenteInventarioResponse(
                        c.getIdParte(),
                        c.getNombreParte(),
                        c.getCantidadParte(),
                        c.getFabricante().getNombreFabricante(),
                        c.getReferencia().getReferencia_dispositivo()
                ))
                .collect(Collectors.toList());
    }

    public Componente guardarComponente(Componente componente) {
        return componenteRepository.save(componente);
    }

    public Componente actualizarComponente(Long id, Componente componente) {
        Componente existente = componenteRepository.findById(id).orElseThrow();
        existente.setNombreParte(componente.getNombreParte());
        existente.setCantidadParte(componente.getCantidadParte());
        existente.setFabricante(componente.getFabricante());
        existente.setReferencia(componente.getReferencia());
        return componenteRepository.save(existente);
    }

    public void eliminarComponente(Long id) {
        componenteRepository.deleteById(id);
    }
}