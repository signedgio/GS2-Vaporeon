package br.com.vaporeon.config;

import br.com.vaporeon.model.Atuador;
import br.com.vaporeon.repository.AtuadorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Cria os atuadores padrao da estacao na primeira execucao (o H2 em arquivo preserva depois). */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedAtuadores(AtuadorRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Atuador("Bomba principal", "BOMBA", true));
                repository.save(new Atuador("Valvula de entrada", "VALVULA", true));
                repository.save(new Atuador("Valvula de saida", "VALVULA", false));
                repository.save(new Atuador("Painel solar (inversor)", "ENERGIA", true));
            }
        };
    }
}