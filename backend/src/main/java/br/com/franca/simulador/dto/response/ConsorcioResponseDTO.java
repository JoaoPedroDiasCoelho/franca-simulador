package br.com.franca.simulador.dto.response;

import java.math.BigDecimal;

public record ConsorcioResponseDTO(
        BigDecimal valorCarta,

        Integer prazoMeses,

        BigDecimal taxaAdministrativaPercentual,

        BigDecimal valorTaxaAdministrativa,

        BigDecimal fundoReservaPercentual,

        BigDecimal valorFundoReserva,

        BigDecimal seguroMensal,

        BigDecimal totalSeguro,

        BigDecimal totalEstimadoPlano,

        BigDecimal valorParcelaEstimada,

        String observacaoLegal
) {}
