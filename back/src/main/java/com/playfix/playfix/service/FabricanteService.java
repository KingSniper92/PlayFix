package com.playfix.playfix.service;

import com.playfix.playfix.model.Fabricante;
import com.playfix.playfix.repository.FabricanteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FabricanteService {

    private final FabricanteRepository fabricanteRepository;

    public FabricanteService(FabricanteRepository fabricanteRepository) {
        this.fabricanteRepository = fabricanteRepository;
    }

    public List<Fabricante> findAll() {
        return fabricanteRepository.findAll();
    }

    public Optional<Fabricante> findById(Long id) {
        return fabricanteRepository.findById(id);
    }

    public Fabricante save(Fabricante fabricante) {
        return fabricanteRepository.save(fabricante);
    }

    public void delete(Long id) {
        fabricanteRepository.deleteById(id);
    }
}