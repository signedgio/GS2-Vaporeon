package br.com.vaporeon.controller;

import br.com.vaporeon.dto.FalhaRequest;
import br.com.vaporeon.model.Falha;
import br.com.vaporeon.service.FalhaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/falhas")
public class FalhaController {

    private final FalhaService service;

    public FalhaController(FalhaService service) {
        this.service = service;
    }

    /** Lista falhas (use ?resolvida=false para ver so as abertas). */
    @GetMapping
    public List<Falha> listar(@RequestParam(required = false) Boolean resolvida) {
        return service.listar(resolvida);
    }

    /** Registra uma falha manualmente. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Falha registrar(@Valid @RequestBody FalhaRequest request) {
        return service.registrar(request);
    }

    /** Marca uma falha como resolvida. */
    @PatchMapping("/{id}/resolver")
    public Falha resolver(@PathVariable Long id) {
        return service.resolver(id);
    }
}