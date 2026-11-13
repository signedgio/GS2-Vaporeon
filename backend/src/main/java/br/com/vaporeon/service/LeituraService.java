package br.com.vaporeon.service;

import br.com.vaporeon.dto.LeituraRequest;
import br.com.vaporeon.exception.RecursoNaoEncontradoException;
import br.com.vaporeon.model.Atuador;
import br.com.vaporeon.model.Leitura;
import br.com.vaporeon.model.Severidade;
import br.com.vaporeon.repository.AtuadorRepository;
import br.com.vaporeon.repository.LeituraRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class LeituraService {

    private final LeituraRepository leituraRepository;
    private final AtuadorRepository atuadorRepository;
    private final FalhaService falhaService;
    private final Random random = new Random();

    private final double nivelMinimo;
    private final double nivelMaximo;
    private final double vazaoMaxima;
    private final double consumoMaximo;

    public LeituraService(LeituraRepository leituraRepository,
                          AtuadorRepository atuadorRepository,
                          FalhaService falhaService,
                          @Value("${vaporeon.limites.nivel-minimo}") double nivelMinimo,
                          @Value("${vaporeon.limites.nivel-maximo}") double nivelMaximo,
                          @Value("${vaporeon.limites.vazao-maxima}") double vazaoMaxima,
                          @Value("${vaporeon.limites.consumo-maximo}") double consumoMaximo) {
        this.leituraRepository = leituraRepository;
        this.atuadorRepository = atuadorRepository;
        this.falhaService = falhaService;
        this.nivelMinimo = nivelMinimo;
        this.nivelMaximo = nivelMaximo;
        this.vazaoMaxima = vazaoMaxima;
        this.consumoMaximo = consumoMaximo;
    }

    @Transactional
    public Leitura registrar(LeituraRequest request) {
        Leitura leitura = leituraRepository.save(new Leitura(
                request.nivelReservatorio(), request.vazao(), request.consumoEletrico()));
        verificarLimites(leitura);
        return leitura;
    }

    @Transactional(readOnly = true)
    public Leitura ultima() {
        return leituraRepository.findFirstByOrderByDataHoraDesc()
                .orElseThrow(() -> new RecursoNaoEncontradoException("Nenhuma leitura registrada ainda"));
    }

    @Transactional(readOnly = true)
    public List<Leitura> listar(int limite) {
        int tamanho = Math.max(1, Math.min(limite, 500));
        return leituraRepository.findAllByOrderByDataHoraDesc(PageRequest.of(0, tamanho));
    }

    /**
     * Gera uma leitura simulada a partir da ultima (passeio aleatorio).
     * Se a bomba estiver desligada, a vazao cai para perto de zero e o consumo fica baixo.
     */
    @Transactional
    public Leitura simular() {
        Leitura anterior = leituraRepository.findFirstByOrderByDataHoraDesc().orElse(null);
        boolean bombaLigada = atuadorRepository.findAllByOrderByIdAsc().stream()
                .filter(a -> a.getNome().toLowerCase().contains("bomba"))
                .findFirst()
                .map(Atuador::isLigado)
                .orElse(true);

        double nivel = anterior == null ? 70 : anterior.getNivelReservatorio();
        nivel = clamp(nivel + (bombaLigada ? 2 : -3) + variacao(6), 0, 100);

        double vazao = bombaLigada ? clamp(60 + variacao(40) + random.nextInt(20), 0, 150) : clamp(variacao(2), 0, 5);
        double consumo = bombaLigada ? clamp(2.5 + vazao / 60.0 + variacao(1), 0.2, 8) : clamp(0.4 + variacao(0.2), 0.1, 1);

        return registrar(new LeituraRequest(arredondar(nivel), arredondar(vazao), arredondar(consumo)));
    }

    private void verificarLimites(Leitura l) {
        if (l.getNivelReservatorio() < nivelMinimo) {
            falhaService.registrarAutomatica("Reservatório",
                    "Nível do reservatório abaixo do limite mínimo (" + (int) nivelMinimo + "%)",
                    Severidade.ALTA, l.getNivelReservatorio(), nivelMinimo, "%");
        }
        if (l.getNivelReservatorio() > nivelMaximo) {
            falhaService.registrarAutomatica("Reservatório",
                    "Nível do reservatório acima do limite máximo (" + (int) nivelMaximo + "%)",
                    Severidade.MEDIA, l.getNivelReservatorio(), nivelMaximo, "%");
        }
        if (l.getVazao() > vazaoMaxima) {
            falhaService.registrarAutomatica("Vazão",
                    "Vazão acima do limite (" + (int) vazaoMaxima + " L/min), possível vazamento",
                    Severidade.CRITICA, l.getVazao(), vazaoMaxima, "L/min");
        }
        if (l.getConsumoEletrico() > consumoMaximo) {
            falhaService.registrarAutomatica("Energia",
                    "Potência elétrica acima do limite (" + consumoMaximo + " kW)",
                    Severidade.ALTA, l.getConsumoEletrico(), consumoMaximo, "kW");
        }
    }

    private double variacao(double amplitude) {
        return (random.nextDouble() * 2 - 1) * amplitude;
    }

    private static double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    private static double arredondar(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}