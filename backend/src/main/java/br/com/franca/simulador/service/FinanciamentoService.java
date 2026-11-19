package br.com.franca.simulador.service;

import br.com.franca.simulador.domain.financiamento.Financiamento;
import br.com.franca.simulador.domain.financiamento.CalculadoraDeParcela;
import br.com.franca.simulador.domain.financiamento.ResultadoFinanciamento;
import br.com.franca.simulador.dto.request.FinanciamentoRequestDTO;
import br.com.franca.simulador.dto.response.FinanciamentoResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FinanciamentoService {
    private final BigDecimal taxaJurosMensalPadrao;
    private final CalculadoraDeParcela calculadora;

    public FinanciamentoService(CalculadoraDeParcela calculadora,
            @Value("${simulador.financiamento.taxa-juros-mensal-padrao:1.89}") BigDecimal taxaJurosMensalPadrao) {
        this.calculadora = calculadora;
        this.taxaJurosMensalPadrao = taxaJurosMensalPadrao;
    }

    public BigDecimal getTaxaJurosMensalPadrao() { return taxaJurosMensalPadrao; }

    public FinanciamentoResponseDTO simular(FinanciamentoRequestDTO request) {
        BigDecimal taxa = request.taxaJurosMensal() == null ? taxaJurosMensalPadrao : request.taxaJurosMensal();
        Financiamento financiamento = new Financiamento(request.valorReferencia(), request.valorEntrada(),
                request.prazoMeses(), taxa.setScale(2, RoundingMode.HALF_UP));
        ResultadoFinanciamento resultado = financiamento.calcular(calculadora);
        String observacao = "Estimativa da parcela calculada pela API pública Math.js usando a Tabela Price e a taxa informada. "
                + "Não representa uma proposta de crédito; os totais usam a parcela arredondada para centavos.";

        return new FinanciamentoResponseDTO(financiamento.valorReferencia(), financiamento.valorEntrada(),
                financiamento.principalFinanciado(), financiamento.prazoMeses(), financiamento.taxaJurosMensal(),
                resultado.valorParcela(), resultado.totalParcelas(), resultado.totalPagoComEntrada(),
                resultado.totalJuros(), "PRICE", observacao);
    }
}
