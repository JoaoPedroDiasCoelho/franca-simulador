package br.com.franca.simulador.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Usuario {

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

    public Usuario(String username, String password, boolean enabled, String role) {
        this(username, null, null, password, enabled, role);
    }

    public Usuario(String username, String email, String nome, String password, boolean enabled, String role) {
        this.username = username;
        this.email = email;
        this.nome = nome;
        this.password = password;
        this.enabled = enabled;
        this.role = role;
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

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
