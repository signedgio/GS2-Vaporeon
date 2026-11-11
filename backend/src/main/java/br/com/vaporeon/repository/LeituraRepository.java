package br.com.vaporeon.repository;

import br.com.vaporeon.model.Leitura;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeituraRepository extends JpaRepository<Leitura, Long> {

    Optional<Leitura> findFirstByOrderByDataHoraDesc();

    List<Leitura> findAllByOrderByDataHoraDesc(Pageable pageable);
}