package br.com.franca.simulador.domain.comparacao;

import java.math.BigDecimal;
import java.math.RoundingMode;

/** Regras de domínio para comparar custo total e valor da parcela. */
public record ResultadoComparacao(BigDecimal diferencaCustoTotal, BigDecimal diferencaParcela,
        String modalidadeMenorCusto, BigDecimal economiaEstimada) {
    public static ResultadoComparacao entre(BigDecimal totalFinanciamento, BigDecimal parcelaFinanciamento,
            BigDecimal totalConsorcio, BigDecimal parcelaConsorcio) {
        BigDecimal diferencaCusto = totalFinanciamento.subtract(totalConsorcio).setScale(2, RoundingMode.HALF_UP);
        BigDecimal diferencaParcela = parcelaFinanciamento.subtract(parcelaConsorcio).setScale(2, RoundingMode.HALF_UP);
        String menorCusto = diferencaCusto.signum() > 0 ? "CONSORCIO" : diferencaCusto.signum() < 0 ? "FINANCIAMENTO" : "CUSTOS_EQUIVALENTES";
        return new ResultadoComparacao(diferencaCusto, diferencaParcela, menorCusto, diferencaCusto.abs());
    }
}
