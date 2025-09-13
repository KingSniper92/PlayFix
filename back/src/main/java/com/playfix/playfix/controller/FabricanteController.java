package com.playfix.playfix.controller;

import com.playfix.playfix.model.Fabricante;
import com.playfix.playfix.service.FabricanteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fabricantes")
@CrossOrigin(origins = "*") // 🔥 permite llamadas desde tu frontend
public class FabricanteController {

    private final FabricanteService fabricanteService;

    public FabricanteController(FabricanteService fabricanteService) {
        this.fabricanteService = fabricanteService;
    }

    @GetMapping
    public List<Fabricante> getAllFabricantes() {
        return fabricanteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fabricante> getFabricanteById(@PathVariable Long id) {
        return fabricanteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Fabricante createFabricante(@RequestBody Fabricante fabricante) {
        return fabricanteService.save(fabricante);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fabricante> updateFabricante(@PathVariable Long id, @RequestBody Fabricante payload) {
        return fabricanteService.findById(id)
                .map(f -> {
                    f.setNombreFabricante(payload.getNombreFabricante());
                    f.setWebFabricante(payload.getWebFabricante());
                    Fabricante actualizado = fabricanteService.save(f);
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFabricante(@PathVariable Long id) {
        if (fabricanteService.findById(id).isPresent()) {
            fabricanteService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}