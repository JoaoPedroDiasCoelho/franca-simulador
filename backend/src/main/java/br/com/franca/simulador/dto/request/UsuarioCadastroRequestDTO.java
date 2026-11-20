package br.com.franca.simulador.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioCadastroRequestDTO(
        @NotBlank(message = "O usuario e obrigatorio")
        @Size(max = 50, message = "O usuario deve ter no maximo 50 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "Use apenas letras, numeros, ponto, hifen ou underscore")
        String usuario,

        @NotBlank(message = "O nome e obrigatorio")
        @Size(max = 150, message = "O nome deve ter no maximo 150 caracteres")
        String nome,

        @NotBlank(message = "O email e obrigatorio")
        @Email(message = "Informe um email valido")
        @Size(max = 254, message = "O email deve ter no maximo 254 caracteres")
        String email,

        @NotBlank(message = "A senha e obrigatoria")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres")
        String senha
) {}
