package com.playfix.playfix.service;

import com.playfix.playfix.model.Referencia;
import com.playfix.playfix.repository.ReferenciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReferenciaService {

    private final ReferenciaRepository referenciaRepository;

    public ReferenciaService(ReferenciaRepository referenciaRepository) {
        this.referenciaRepository = referenciaRepository;
    }

    public List<Referencia> listarTodas() {
        return referenciaRepository.findAll();
    }

    public Optional<Referencia> buscarPorId(Long id) {
        return referenciaRepository.findById(id);
    }

    public Referencia guardar(Referencia referencia) {
        return referenciaRepository.save(referencia);
    }

    public void eliminar(Long id) {
        referenciaRepository.deleteById(id);
    }
}