package br.com.franca.simulador.dto.response;

import java.math.BigDecimal;

public record FinanciamentoResponseDTO(
        BigDecimal valorReferencia,

        BigDecimal valorEntrada,

        BigDecimal valorFinanciado,

        Integer prazoMeses,

        BigDecimal taxaJurosMensal,

        BigDecimal valorParcela,

        BigDecimal totalParcelas,

        BigDecimal totalPagoComEntrada,

        BigDecimal totalJurosEstimado,

        String sistemaAmortizacao,

        String observacaoLegal
) {}
