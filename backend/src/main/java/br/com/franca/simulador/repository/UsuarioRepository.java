package br.com.franca.simulador.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final JdbcTemplate jdbcTemplate;

    public UsuarioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> listarAdministradores() {
        return jdbcTemplate.queryForList(
                "SELECT username FROM users WHERE role = ? ORDER BY username",
                String.class,
                "ROLE_ADMIN"
        );
    }

    public Optional<UsuarioAutenticacao> buscarParaAutenticacao(String username) {
        return jdbcTemplate.query("""
                SELECT username, password, enabled, role
                FROM users
                WHERE username = ?
                """, result -> result.next()
                ? Optional.of(new UsuarioAutenticacao(
                        result.getString("username"),
                        result.getString("password"),
                        result.getBoolean("enabled"),
                        result.getString("role")
                ))
                : Optional.empty(), username);
    }

    public String buscarNome(String username) {
        return jdbcTemplate.queryForObject(
                "SELECT COALESCE(NULLIF(BTRIM(nome), ''), username) FROM users WHERE username = ?",
                String.class,
                username
        );
    }

    public boolean existe(String username) {
        return Boolean.TRUE.equals(jdbcTemplate.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM users WHERE username = ?)",
                Boolean.class,
                username
        ));
    }

    public void criarCliente(String email, String nome, String senhaCodificada) {
        jdbcTemplate.update("""
                INSERT INTO users (username, email, nome, password, enabled, role)
                VALUES (?, ?, ?, ?, TRUE, 'ROLE_CLIENTE')
                """, email, email, nome, senhaCodificada);
    }

    public void criarAdministrador(String username, String senhaCodificada) {
        jdbcTemplate.update("""
                INSERT INTO users (username, password, enabled, role)
                VALUES (?, ?, TRUE, 'ROLE_ADMIN')
                """, username, senhaCodificada);
    }

    public void salvarAdministradorConfigurado(String username, String senhaCodificada) {
        jdbcTemplate.update("""
                INSERT INTO users (username, password, enabled, role)
                VALUES (?, ?, TRUE, 'ROLE_ADMIN')
                ON CONFLICT (username) DO UPDATE
                SET password = EXCLUDED.password,
                    enabled = TRUE,
                    role = 'ROLE_ADMIN'
                """, username, senhaCodificada);
    }

    public record UsuarioAutenticacao(String username, String password, boolean enabled, String role) {}
}
