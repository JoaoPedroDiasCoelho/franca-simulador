package br.com.franca.simulador.domain.financiamento;

import java.math.BigDecimal;

/** Resultado calculado do financiamento. */
public record ResultadoFinanciamento(Financiamento financiamento, BigDecimal valorParcela,
        BigDecimal totalParcelas, BigDecimal totalPagoComEntrada, BigDecimal totalJuros) {}
