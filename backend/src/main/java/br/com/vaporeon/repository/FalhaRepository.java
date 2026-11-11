package br.com.vaporeon.repository;

import br.com.vaporeon.model.Falha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FalhaRepository extends JpaRepository<Falha, Long> {

    List<Falha> findAllByOrderByDataHoraDesc();

    List<Falha> findByResolvidaOrderByDataHoraDesc(boolean resolvida);

    /** Evita criar o mesmo alerta repetido enquanto o anterior ainda esta aberto. */
    boolean existsByOrigemAndDescricaoAndResolvidaFalse(String origem, String descricao);
}