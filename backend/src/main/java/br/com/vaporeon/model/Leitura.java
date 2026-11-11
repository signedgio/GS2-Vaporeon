package br.com.vaporeon.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Uma leitura dos sensores da estacao em um instante. */
@Entity
@Table(name = "leitura")
public class Leitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nivel do reservatorio de agua, em % (0 a 100). */
    @Column(nullable = false)
    private double nivelReservatorio;

    /** Vazao da agua, em litros por minuto. */
    @Column(nullable = false)
    private double vazao;

    /** Consumo eletrico simulado, em kW. */
    @Column(nullable = false)
    private double consumoEletrico;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    public Leitura() {
    }

    public Leitura(double nivelReservatorio, double vazao, double consumoEletrico) {
        this.nivelReservatorio = nivelReservatorio;
        this.vazao = vazao;
        this.consumoEletrico = consumoEletrico;
        this.dataHora = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public double getNivelReservatorio() { return nivelReservatorio; }
    public void setNivelReservatorio(double nivelReservatorio) { this.nivelReservatorio = nivelReservatorio; }
    public double getVazao() { return vazao; }
    public void setVazao(double vazao) { this.vazao = vazao; }
    public double getConsumoEletrico() { return consumoEletrico; }
    public void setConsumoEletrico(double consumoEletrico) { this.consumoEletrico = consumoEletrico; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
}