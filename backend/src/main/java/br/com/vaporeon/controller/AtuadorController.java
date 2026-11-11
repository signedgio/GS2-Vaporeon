package br.com.vaporeon.controller;

import br.com.vaporeon.dto.AcionarRequest;
import br.com.vaporeon.model.Atuador;
import br.com.vaporeon.service.AtuadorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atuadores")
public class AtuadorController {

    private final AtuadorService service;

    public AtuadorController(AtuadorService service) {
        this.service = service;
    }

    /** Lista os atuadores e seus estados. */
    @GetMapping
    public List<Atuador> listar() {
        return service.listar();
    }

    /** Liga ou desliga um atuador. */
    @PostMapping("/{id}/acionar")
    public Atuador acionar(@PathVariable Long id, @Valid @RequestBody AcionarRequest request) {
        return service.acionar(id, request.ligar());
    }
}