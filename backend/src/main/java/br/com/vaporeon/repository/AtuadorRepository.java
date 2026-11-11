package br.com.vaporeon.repository;

import br.com.vaporeon.model.Atuador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AtuadorRepository extends JpaRepository<Atuador, Long> {

    List<Atuador> findAllByOrderByIdAsc();
}