package com.playfix.playfix.controller;

import com.playfix.playfix.model.Referencia;
import com.playfix.playfix.service.ReferenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referencias")
@CrossOrigin(origins = "*")
public class ReferenciaController {

    private final ReferenciaService referenciaService;

    public ReferenciaController(ReferenciaService referenciaService) {
        this.referenciaService = referenciaService;
    }

    @GetMapping
    public List<Referencia> listarTodas() {
        return referenciaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Referencia> obtenerPorId(@PathVariable Long id) {
        return referenciaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Referencia crear(@RequestBody Referencia referencia) {
        return referenciaService.guardar(referencia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Referencia> actualizar(@PathVariable Long id, @RequestBody Referencia referencia) {
        return referenciaService.buscarPorId(id)
                .map(r -> {
                    r.setReferencia_dispositivo(referencia.getReferencia_dispositivo());
                    return ResponseEntity.ok(referenciaService.guardar(r));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return referenciaService.buscarPorId(id)
                .map(r -> {
                    referenciaService.eliminar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}