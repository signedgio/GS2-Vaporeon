package br.com.vaporeon.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Equipamento controlavel da estacao (bomba, valvula, etc). */
@Entity
@Table(name = "atuador")
public class Atuador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private boolean ligado;

    @Column(nullable = false)
    private LocalDateTime ultimaAtualizacao;

    public Atuador() {
    }

    public Atuador(String nome, String tipo, boolean ligado) {
        this.nome = nome;
        this.tipo = tipo;
        this.ligado = ligado;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public boolean isLigado() { return ligado; }
    public void setLigado(boolean ligado) { this.ligado = ligado; }
    public LocalDateTime getUltimaAtualizacao() { return ultimaAtualizacao; }
    public void setUltimaAtualizacao(LocalDateTime ultimaAtualizacao) { this.ultimaAtualizacao = ultimaAtualizacao; }
}