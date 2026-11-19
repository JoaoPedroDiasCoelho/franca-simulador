package br.com.franca.simulador.domain.financiamento;

import br.com.franca.simulador.exception.RegraDeNegocioException;
import java.math.BigDecimal;
import java.math.RoundingMode;

/** Representa um financiamento e mantém suas regras e cálculos monetários. */
public record Financiamento(BigDecimal valorReferencia, BigDecimal valorEntrada, int prazoMeses, BigDecimal taxaJurosMensal) {
    public Financiamento {
        valorReferencia = dinheiroObrigatorio(valorReferencia);
        valorEntrada = dinheiro(valorEntrada == null ? BigDecimal.ZERO : valorEntrada);
        taxaJurosMensal = dinheiroObrigatorio(taxaJurosMensal);
        if (valorEntrada.signum() < 0) throw new RegraDeNegocioException("O valor da entrada não pode ser negativo.");
        if (valorEntrada.compareTo(valorReferencia) >= 0) throw new RegraDeNegocioException("O valor da entrada não pode ser igual ou superior ao valor da moto para contratação de financiamento.");
        if (prazoMeses < 1) throw new RegraDeNegocioException("O prazo do financiamento deve ser de no mínimo 1 mês.");
        if (taxaJurosMensal.signum() < 0) throw new RegraDeNegocioException("A taxa de juros não pode ser negativa.");
    }

    public BigDecimal principalFinanciado() {
        return valorReferencia.subtract(valorEntrada).setScale(2, RoundingMode.HALF_UP);
    }

    public ResultadoFinanciamento calcular(CalculadoraDeParcela calculadora) {
        BigDecimal parcela = dinheiro(calculadora.calcular(principalFinanciado(), taxaJurosMensal, prazoMeses));
        BigDecimal totalParcelas = dinheiro(parcela.multiply(BigDecimal.valueOf(prazoMeses)));
        BigDecimal totalPago = dinheiro(totalParcelas.add(valorEntrada));
        BigDecimal juros = dinheiro(totalParcelas.subtract(principalFinanciado()));
        return new ResultadoFinanciamento(this, parcela, totalParcelas, totalPago, juros);
    }

    private static BigDecimal dinheiroObrigatorio(BigDecimal valor) {
        if (valor == null) throw new RegraDeNegocioException("Os valores do financiamento são obrigatórios.");
        return dinheiro(valor);
    }

    private static BigDecimal dinheiro(BigDecimal valor) { return valor.setScale(2, RoundingMode.HALF_UP); }
}
