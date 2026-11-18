package br.com.franca.simulador.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "moto_imagens")
public class MotoImagem {

    @Id
    @Column(name = "moto_id")
    private Long motoId;

    @Column(nullable = false, columnDefinition = "bytea")
    private byte[] conteudo;

    @Column(name = "tipo_conteudo", nullable = false, length = 30)
    private String tipoConteudo;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    public MotoImagem() {
    }

    public MotoImagem(Long motoId, byte[] conteudo, String tipoConteudo) {
        this.motoId = motoId;
        this.conteudo = conteudo;
        this.tipoConteudo = tipoConteudo;
    }

    public Long getMotoId() {
        return motoId;
    }

    public byte[] getConteudo() {
        return conteudo;
    }

    public String getTipoConteudo() {
        return tipoConteudo;
    }

    @PrePersist
    protected void aoCriar() {
        atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void aoAtualizar() {
        atualizadoEm = LocalDateTime.now();
    }
}
