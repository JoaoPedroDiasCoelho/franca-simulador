package br.com.franca.simulador.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ConsorcioRequestDTO(
        Long motoId,

        @NotNull(message = "O valor da carta de crédito é obrigatório")
        @DecimalMin(value = "500.00", message = "O valor da carta de crédito deve ser de no mínimo R$ 500,00")
        BigDecimal valorCarta,

        @NotNull(message = "O prazo em meses é obrigatório")
        @Min(value = 6, message = "O prazo do consórcio deve ser de no mínimo 6 meses")
        @Max(value = 120, message = "O prazo do consórcio não pode ultrapassar 120 meses")
        Integer prazoMeses,

        @DecimalMin(value = "0.00", message = "A taxa de administração não pode ser negativa")
        @DecimalMax(value = "40.00", message = "A taxa de administração máxima permitida é 40%")
        BigDecimal taxaAdministrativaTotal,

        @DecimalMin(value = "0.00", message = "O percentual do fundo de reserva não pode ser negativo")
        @DecimalMax(value = "15.00", message = "O fundo de reserva máximo permitido é 15%")
        BigDecimal fundoReservaPercentual,

        @DecimalMin(value = "0.00", message = "O seguro mensal não pode ser negativo")
        BigDecimal seguroMensal
) {}
