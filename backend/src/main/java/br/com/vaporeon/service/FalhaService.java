package br.com.vaporeon.service;

import br.com.vaporeon.dto.FalhaRequest;
import br.com.vaporeon.exception.RecursoNaoEncontradoException;
import br.com.vaporeon.model.Falha;
import br.com.vaporeon.model.Severidade;
import br.com.vaporeon.repository.FalhaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FalhaService {

    private final FalhaRepository repository;

    public FalhaService(FalhaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Falha> listar(Boolean resolvida) {
        if (resolvida == null) {
            return repository.findAllByOrderByDataHoraDesc();
        }
        return repository.findByResolvidaOrderByDataHoraDesc(resolvida);
    }

    @Transactional
    public Falha registrar(FalhaRequest request) {
        return repository.save(new Falha(request.origem(), request.descricao(), request.severidade()));
    }

    /** Usado internamente quando uma leitura ultrapassa os limites. Ignora duplicadas abertas. */
    @Transactional
    public void registrarAutomatica(String origem, String descricao, Severidade severidade) {
        if (!repository.existsByOrigemAndDescricaoAndResolvidaFalse(origem, descricao)) {
            repository.save(new Falha(origem, descricao, severidade));
        }
    }

    @Transactional
    public Falha resolver(Long id) {
        Falha falha = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Falha " + id + " nao encontrada"));
        falha.setResolvida(true);
        return falha;
    }
}
