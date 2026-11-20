package br.com.franca.simulador.model;

import br.com.franca.simulador.exception.RegraDeNegocioException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "users")
public class Usuario {

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_CLIENTE = "ROLE_CLIENTE";

    @Id
    @Column(length = 254)
    private String username;

    @Column(nullable = false, length = 500)
    private String password;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(length = 150)
    private String nome;

    @Column(length = 254)
    private String email;

    @Column(nullable = false, length = 50)
    private String role;

    public Usuario() {
    }

    private Usuario(String username, String email, String nome, String password, boolean enabled, String role) {
        this.username = username;
        this.email = email;
        this.nome = nome;
        this.password = password;
        this.enabled = enabled;
        this.role = role;
    }

    public static Usuario administrador(String username, String senhaCodificada) {
        return new Usuario(username, null, null, senhaCodificada, true, ROLE_ADMIN);
    }

    public static Usuario administrador(String username, String email, String nome, String senhaCodificada) {
        return new Usuario(username, email, nome, senhaCodificada, true, ROLE_ADMIN);
    }

    public static Usuario cliente(String email, String nome, String senhaCodificada) {
        return new Usuario(email, email, nome, senhaCodificada, true, ROLE_CLIENTE);
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getNome() {
        return nome;
    }

    public String nomeExibicao() {
        return nome == null || nome.isBlank() ? username : nome.trim();
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public void configurarComoAdministrador(String senhaCodificada) {
        this.password = senhaCodificada;
        this.enabled = true;
        this.role = ROLE_ADMIN;
    }

    public boolean isAdministradorAtivo() {
        return enabled && ROLE_ADMIN.equals(role);
    }

    public void validarExclusaoPor(String usernameSolicitante, int totalAdministradoresAtivos) {
        if (Objects.equals(username, usernameSolicitante)) {
            throw new RegraDeNegocioException("Nao e permitido excluir o usuario autenticado.");
        }
        if (isAdministradorAtivo() && totalAdministradoresAtivos <= 1) {
            throw new RegraDeNegocioException("O ultimo administrador nao pode ser excluido.");
        }
    }
}
