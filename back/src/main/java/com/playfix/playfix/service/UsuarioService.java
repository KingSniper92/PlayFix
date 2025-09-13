package com.playfix.playfix.service;

import com.playfix.playfix.model.Usuario;
import com.playfix.playfix.repository.UsuarioRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    public UsuarioService(UsuarioRepository repo) {
        this.repo = repo;
    }

    public List<Usuario> listar() {
        return repo.findAll();
    }

    public Usuario obtener(int id) {
        return repo.findById(id);
    }

    public Usuario crear(Usuario u) throws DuplicateKeyException {
        return repo.insert(u);
    }

    public boolean actualizar(int id, Usuario u) throws DuplicateKeyException {
        return repo.update(id, u);
    }

    public boolean eliminar(int id) {
        return repo.delete(id);
    }
}