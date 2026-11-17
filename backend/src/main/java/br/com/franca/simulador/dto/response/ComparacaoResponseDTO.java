package br.com.franca.simulador.dto.response;

import java.math.BigDecimal;

public record ComparacaoResponseDTO(
        FinanciamentoResponseDTO financiamento,

        ConsorcioResponseDTO consorcio,

        BigDecimal diferencaCustoTotal,

        BigDecimal diferencaParcela,

        String modalidadeMenorCusto,

        BigDecimal economiaEstimada
) {}
