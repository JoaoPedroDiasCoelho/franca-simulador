package br.com.franca.simulador.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Repository
public class ClienteConviteRepository {

    private final JdbcTemplate jdbcTemplate;

    public ClienteConviteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void salvarConvite(String email, String nome, String tokenHash, Instant expiraEm) {
        jdbcTemplate.update("""
                INSERT INTO cliente_convites (email, nome, token_hash, expires_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (email) DO UPDATE
                SET nome = EXCLUDED.nome,
                    token_hash = EXCLUDED.token_hash,
                    expires_at = EXCLUDED.expires_at
                """, email, nome, tokenHash, Timestamp.from(expiraEm));
    }

    public Optional<Convite> buscarConviteValido(String tokenHash) {
        return jdbcTemplate.query("""
                SELECT email, nome
                FROM cliente_convites
                WHERE token_hash = ? AND expires_at > CURRENT_TIMESTAMP
                """, result -> result.next()
                ? Optional.of(new Convite(result.getString("email"), result.getString("nome")))
                : Optional.empty(), tokenHash);
    }

    public void removerConvite(String email, String tokenHash) {
        jdbcTemplate.update(
                "DELETE FROM cliente_convites WHERE email = ? AND token_hash = ?",
                email,
                tokenHash
        );
    }

    public record Convite(String email, String nome) {}
}
