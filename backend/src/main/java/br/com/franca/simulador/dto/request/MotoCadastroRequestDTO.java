package br.com.franca.simulador.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MotoCadastroRequestDTO(
        @NotBlank(message = "Informe a marca")
        @Size(max = 50, message = "A marca deve ter no máximo 50 caracteres")
        String marca,

        @NotBlank(message = "Informe o modelo")
        @Size(max = 100, message = "O modelo deve ter no máximo 100 caracteres")
        String modelo,

        @NotBlank(message = "Informe a categoria")
        @Size(max = 50, message = "A categoria deve ter no máximo 50 caracteres")
        String categoria,

        @NotNull(message = "Informe a cilindrada")
        @Positive(message = "A cilindrada deve ser maior que zero")
        Integer cilindrada,

        @NotNull(message = "Informe o ano do modelo")
        @Min(value = 1900, message = "O ano deve ser igual ou posterior a 1900")
        @Max(value = 2100, message = "O ano deve ser igual ou anterior a 2100")
        Integer anoModelo,

        @NotNull(message = "Informe o preço")
        @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero")
        @Digits(integer = 10, fraction = 2, message = "O preço deve ter até 10 dígitos inteiros e 2 decimais")
        BigDecimal preco,

        @Size(max = 500, message = "A URL da imagem deve ter no máximo 500 caracteres")
        String imagemUrl,

        @Size(max = 3000, message = "A descrição deve ter no máximo 3000 caracteres")
        String descricao
) {}
