package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.FinanciamentoRequestDTO;
import br.com.franca.simulador.dto.response.FinanciamentoResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FinanciamentoService {

    private final BigDecimal taxaJurosMensalPadrao;
    private final MathJsClient mathJsClient;

    public FinanciamentoService(
            MathJsClient mathJsClient,
            @Value("${simulador.financiamento.taxa-juros-mensal-padrao:1.89}") BigDecimal taxaJurosMensalPadrao) {
        this.mathJsClient = mathJsClient;
        this.taxaJurosMensalPadrao = taxaJurosMensalPadrao;
    }

    public BigDecimal getTaxaJurosMensalPadrao() {
        return taxaJurosMensalPadrao;
    }

    public FinanciamentoResponseDTO simular(FinanciamentoRequestDTO request) {
        BigDecimal valorReferencia = request.valorReferencia().setScale(2, RoundingMode.HALF_UP);
        BigDecimal valorEntrada = request.valorEntrada() != null
                ? request.valorEntrada().setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO.setScale(2);
        int prazo = request.prazoMeses();

        if (valorEntrada.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor da entrada não pode ser negativo.");
        }

        if (valorEntrada.compareTo(valorReferencia) >= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O valor da entrada não pode ser igual ou superior ao valor da moto para contratação de financiamento.");
        }

        if (prazo < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O prazo do financiamento deve ser de no mínimo 1 mês.");
        }

        BigDecimal taxaMensal = request.taxaJurosMensal() != null
                ? request.taxaJurosMensal().setScale(2, RoundingMode.HALF_UP)
                : taxaJurosMensalPadrao.setScale(2, RoundingMode.HALF_UP);
        BigDecimal principalFinanciado = valorReferencia.subtract(valorEntrada).setScale(2, RoundingMode.HALF_UP);
        BigDecimal valorParcela = mathJsClient.calcularParcela(principalFinanciado, taxaMensal, prazo)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalParcelas = valorParcela.multiply(BigDecimal.valueOf(prazo)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalPagoComEntrada = totalParcelas.add(valorEntrada).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalJuros = totalParcelas.subtract(principalFinanciado).setScale(2, RoundingMode.HALF_UP);

        String observacaoLegal = "Estimativa da parcela calculada pela API pública Math.js usando a Tabela Price e a taxa informada. "
                + "Não representa uma proposta de crédito; os totais usam a parcela arredondada para centavos.";

        return new FinanciamentoResponseDTO(
                valorReferencia,
                valorEntrada,
                principalFinanciado,
                prazo,
                taxaMensal,
                valorParcela,
                totalParcelas,
                totalPagoComEntrada,
                totalJuros,
                "PRICE",
                observacaoLegal
        );
    }
}
