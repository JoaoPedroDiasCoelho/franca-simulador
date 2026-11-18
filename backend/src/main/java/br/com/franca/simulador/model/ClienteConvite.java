package br.com.franca.simulador.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(name = "cliente_convites")
public class ClienteConvite {

    @Id
    @Column(length = 254)
    private String email;

    @Column(nullable = false, length = 150)
    private String nome;

    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiraEm;

    public ClienteConvite() {
    }

    public ClienteConvite(String email, String nome, String tokenHash, Instant expiraEm) {
        this.email = email;
        this.nome = nome;
        this.tokenHash = tokenHash;
        this.expiraEm = expiraEm;
    }

    public String getEmail() {
        return email;
    }

    public String getNome() {
        return nome;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public Instant getExpiraEm() {
        return expiraEm;
    }

    public void atualizar(String nome, String tokenHash, Instant expiraEm) {
        this.nome = nome;
        this.tokenHash = tokenHash;
        this.expiraEm = expiraEm;
    }
}
