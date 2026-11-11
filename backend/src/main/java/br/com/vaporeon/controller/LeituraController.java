package br.com.vaporeon.controller;

import br.com.vaporeon.dto.LeituraRequest;
import br.com.vaporeon.model.Leitura;
import br.com.vaporeon.service.LeituraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leituras")
public class LeituraController {

    private final LeituraService service;

    public LeituraController(LeituraService service) {
        this.service = service;
    }

    /** Registra uma nova leitura (gera alertas se passar dos limites). */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Leitura registrar(@Valid @RequestBody LeituraRequest request) {
        return service.registrar(request);
    }

    /** Gera e registra uma leitura simulada (usado na demonstracao). */
    @PostMapping("/simular")
    @ResponseStatus(HttpStatus.CREATED)
    public Leitura simular() {
        return service.simular();
    }

    /** Retorna a leitura mais recente (404 se nao houver nenhuma). */
    @GetMapping("/ultima")
    public Leitura ultima() {
        return service.ultima();
    }

    /** Lista o historico de leituras, da mais recente para a mais antiga. */
    @GetMapping
    public List<Leitura> listar(@RequestParam(defaultValue = "50") int limite) {
        return service.listar(limite);
    }
}