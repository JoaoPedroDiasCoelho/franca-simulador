package br.com.franca.simulador.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioCadastroRequestDTO(
        @NotBlank(message = "O usuario e obrigatorio")
        @Size(max = 50, message = "O usuario deve ter no maximo 50 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "Use apenas letras, numeros, ponto, hifen ou underscore")
        String usuario,

        @NotBlank(message = "A senha e obrigatoria")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres")
        String senha
) {}
