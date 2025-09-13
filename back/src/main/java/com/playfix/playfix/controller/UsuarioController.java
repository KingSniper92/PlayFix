package com.playfix.playfix.controller;

import com.playfix.playfix.model.Usuario;
import com.playfix.playfix.service.UsuarioService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable int id) {
        Usuario u = service.obtener(id);
        return (u == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(u);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario u) {
        try {
            Usuario creado = service.crear(u);
            return ResponseEntity.created(URI.create("/api/usuarios/" + creado.getIdUsuario())).body(creado);
        } catch (DuplicateKeyException ex) {
            return ResponseEntity.status(409).body("{\"message\":\"correo_usuario ya existe\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable int id, @RequestBody Usuario u) {
        try {
            boolean ok = service.actualizar(id, u);
            return ok ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (DuplicateKeyException ex) {
            return ResponseEntity.status(409).body("{\"message\":\"correo_usuario ya existe\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        boolean ok = service.eliminar(id);
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}