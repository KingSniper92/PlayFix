package com.playfix.playfix.controller;

import com.playfix.playfix.model.Estado;
import com.playfix.playfix.service.EstadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estados")
@CrossOrigin(origins = "*")
public class EstadoController {

    private final EstadoService estadoService;

    public EstadoController(EstadoService estadoService) {
        this.estadoService = estadoService;
    }

    @GetMapping
    public List<Estado> listarTodos() {
        return estadoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estado> obtenerPorId(@PathVariable Long id) {
        return estadoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Estado crear(@RequestBody Estado estado) {
        return estadoService.guardar(estado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estado> actualizar(@PathVariable Long id, @RequestBody Estado estado) {
        return estadoService.buscarPorId(id)
                .map(e -> {
                    e.setEstadoDispositivo(estado.getEstadoDispositivo());
                    return ResponseEntity.ok(estadoService.guardar(e));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return estadoService.buscarPorId(id)
                .map(e -> {
                    estadoService.eliminar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}