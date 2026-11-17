package br.com.franca.simulador.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record FinanciamentoRequestDTO(
        Long motoId,

        @NotNull(message = "O valor de referência da moto é obrigatório")
        @DecimalMin(value = "500.00", message = "O valor de referência deve ser de no mínimo R$ 500,00")
        BigDecimal valorReferencia,

        @NotNull(message = "O valor da entrada é obrigatório (pode ser 0.00)")
        @DecimalMin(value = "0.00", message = "O valor da entrada não pode ser negativo")
        BigDecimal valorEntrada,

        @NotNull(message = "O prazo em meses é obrigatório")
        @Min(value = 1, message = "O prazo deve ser de no mínimo 1 mês")
        @Max(value = 120, message = "O prazo máximo permitido é de 120 meses")
        Integer prazoMeses,

        @DecimalMin(value = "0.00", message = "A taxa de juros não pode ser negativa")
        @DecimalMax(value = "15.00", message = "A taxa de juros máxima permitida é 15% ao mês")
        BigDecimal taxaJurosMensal
) {}
