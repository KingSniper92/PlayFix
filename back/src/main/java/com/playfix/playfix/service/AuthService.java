package com.playfix.playfix.service;

import com.playfix.playfix.model.Usuario;
import com.playfix.playfix.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public boolean login(String correo, String clave) {
        Usuario usuario = usuarioRepository.findByCorreoAndClave(correo, clave);
        return usuario != null;
    }
}