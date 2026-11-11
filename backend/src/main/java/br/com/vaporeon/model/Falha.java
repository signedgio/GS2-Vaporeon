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

    public Falha() {
    }

    public Falha(String origem, String descricao, Severidade severidade) {
        this.origem = origem;
        this.descricao = descricao;
        this.severidade = severidade;
        this.resolvida = false;
        this.dataHora = LocalDateTime.now();
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
}