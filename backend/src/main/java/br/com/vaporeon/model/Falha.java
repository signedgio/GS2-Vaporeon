package br.com.vaporeon.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Alerta de falha detectada (automaticamente ou registrada manualmente). */
@Entity
@Table(name = "falha")
public class Falha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origem;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severidade severidade;

    @Column(nullable = false)
    private boolean resolvida;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    /** Leitura que originou o alerta (vazio em alertas registrados manualmente). */
    private Double valorMedido;

    /** Limite configurado que foi ultrapassado (vazio em alertas manuais). */
    private Double limite;

    /** Unidade da leitura e do limite, por exemplo "%", "L/min" ou "kW". */
    @Column(length = 20)
    private String unidade;

    public Falha() {
    }

    public Falha(String origem, String descricao, Severidade severidade) {
        this(origem, descricao, severidade, null, null, null);
    }

    public Falha(String origem, String descricao, Severidade severidade,
                 Double valorMedido, Double limite, String unidade) {
        this.origem = origem;
        this.descricao = descricao;
        this.severidade = severidade;
        this.resolvida = false;
        this.dataHora = LocalDateTime.now();
        this.valorMedido = valorMedido;
        this.limite = limite;
        this.unidade = unidade;
    }

    public Long getId() { return id; }
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Severidade getSeveridade() { return severidade; }
    public void setSeveridade(Severidade severidade) { this.severidade = severidade; }
    public boolean isResolvida() { return resolvida; }
    public void setResolvida(boolean resolvida) { this.resolvida = resolvida; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Double getValorMedido() { return valorMedido; }
    public void setValorMedido(Double valorMedido) { this.valorMedido = valorMedido; }
    public Double getLimite() { return limite; }
    public void setLimite(Double limite) { this.limite = limite; }
    public String getUnidade() { return unidade; }
    public void setUnidade(String unidade) { this.unidade = unidade; }
}