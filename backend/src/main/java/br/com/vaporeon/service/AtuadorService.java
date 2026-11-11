package br.com.vaporeon.service;

import br.com.vaporeon.exception.RecursoNaoEncontradoException;
import br.com.vaporeon.model.Atuador;
import br.com.vaporeon.repository.AtuadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AtuadorService {

    private final AtuadorRepository repository;

    public AtuadorService(AtuadorRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Atuador> listar() {
        return repository.findAllByOrderByIdAsc();
    }

    @Transactional
    public Atuador acionar(Long id, boolean ligar) {
        Atuador atuador = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atuador " + id + " nao encontrado"));
        atuador.setLigado(ligar);
        atuador.setUltimaAtualizacao(LocalDateTime.now());
        return atuador;
    }
}