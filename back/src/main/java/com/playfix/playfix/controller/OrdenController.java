package com.playfix.playfix.controller;

import com.playfix.playfix.model.Orden;
import com.playfix.playfix.service.OrdenService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @GetMapping
    public List<Orden> listarOrdenes() {
        return ordenService.listarOrdenes();
    }

    @PostMapping
    public Orden guardarOrden(@RequestBody Orden orden) {
        return ordenService.guardarOrden(orden);
    }

    @PutMapping("/{id}")
    public Orden actualizarOrden(@PathVariable Long id, @RequestBody Orden orden) {
        return ordenService.actualizarOrden(id, orden);
    }

    @DeleteMapping("/{id}")
    public void eliminarOrden(@PathVariable Long id) {
        ordenService.eliminarOrden(id);
    }
}