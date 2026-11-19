package br.com.franca.simulador.domain.financiamento;

import java.math.BigDecimal;

/** Porta de cálculo. O domínio não conhece o provedor que calcula a parcela. */
public interface CalculadoraDeParcela {
    BigDecimal calcular(BigDecimal principal, BigDecimal taxaMensal, int prazoMeses);
}
