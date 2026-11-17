package br.com.franca.simulador.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ComparacaoRequestDTO(
        Long motoId,

        @NotNull(message = "O valor de referência da moto é obrigatório")
        @DecimalMin(value = "500.00", message = "O valor de referência deve ser de no mínimo R$ 500,00")
        BigDecimal valorReferencia,

        @NotNull(message = "O valor de entrada para o financiamento é obrigatório")
        @DecimalMin(value = "0.00", message = "A entrada não pode ser negativa")
        BigDecimal valorEntrada,

        @NotNull(message = "O prazo comum em meses é obrigatório")
        @Min(value = 6, message = "O prazo deve ser de no mínimo 6 meses")
        @Max(value = 120, message = "O prazo máximo é 120 meses")
        Integer prazoMeses,

        @DecimalMin(value = "0.00", message = "A taxa de juros do financiamento não pode ser negativa")
        BigDecimal taxaJurosFinanciamento,

        @DecimalMin(value = "0.00", message = "A taxa administrativa do consórcio não pode ser negativa")
        BigDecimal taxaAdmConsorcio,

        @DecimalMin(value = "0.00", message = "O fundo de reserva não pode ser negativo")
        BigDecimal fundoReservaConsorcio,

        @DecimalMin(value = "0.00", message = "O seguro mensal do consórcio não pode ser negativo")
        BigDecimal seguroMensalConsorcio
) {}
