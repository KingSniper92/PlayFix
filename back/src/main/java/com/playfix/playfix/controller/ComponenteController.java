package com.playfix.playfix.controller;

import com.playfix.playfix.dto.ComponenteInventarioResponse;
import com.playfix.playfix.model.Componente;
import com.playfix.playfix.service.ComponenteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/componentes")
@CrossOrigin(origins = "*") // para evitar problemas de CORS en el frontend
public class ComponenteController {

    private final ComponenteService componenteService;

    public ComponenteController(ComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    @GetMapping
    public List<ComponenteInventarioResponse> listarComponentes() {
        return componenteService.listarComponentes();
    }

    @PostMapping
    public Componente crearComponente(@RequestBody Componente componente) {
        return componenteService.guardarComponente(componente);
    }

    @PutMapping("/{id}")
    public Componente actualizarComponente(@PathVariable Long id, @RequestBody Componente componente) {
        return componenteService.actualizarComponente(id, componente);
    }

    @DeleteMapping("/{id}")
    public void eliminarComponente(@PathVariable Long id) {
        componenteService.eliminarComponente(id);
    }
}