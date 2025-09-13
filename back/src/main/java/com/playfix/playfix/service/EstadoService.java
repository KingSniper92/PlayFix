package com.playfix.playfix.service;

import com.playfix.playfix.model.Estado;
import com.playfix.playfix.repository.EstadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstadoService {

    private final EstadoRepository estadoRepository;

    public EstadoService(EstadoRepository estadoRepository) {
        this.estadoRepository = estadoRepository;
    }

    public List<Estado> listarTodos() {
        return estadoRepository.findAll();
    }

    public Optional<Estado> buscarPorId(Long id) {
        return estadoRepository.findById(id);
    }

    public Estado guardar(Estado estado) {
        return estadoRepository.save(estado);
    }

    public void eliminar(Long id) {
        estadoRepository.deleteById(id);
    }
}