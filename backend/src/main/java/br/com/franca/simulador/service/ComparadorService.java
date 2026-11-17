package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.ComparacaoRequestDTO;
import br.com.franca.simulador.dto.request.ConsorcioRequestDTO;
import br.com.franca.simulador.dto.request.FinanciamentoRequestDTO;
import br.com.franca.simulador.dto.response.ComparacaoResponseDTO;
import br.com.franca.simulador.dto.response.ConsorcioResponseDTO;
import br.com.franca.simulador.dto.response.FinanciamentoResponseDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ComparadorService {

    private final FinanciamentoService financiamentoService;
    private final ConsorcioService consorcioService;

    public ComparadorService(FinanciamentoService financiamentoService, ConsorcioService consorcioService) {
        this.financiamentoService = financiamentoService;
        this.consorcioService = consorcioService;
    }

    public ComparacaoResponseDTO comparar(ComparacaoRequestDTO request) {
        FinanciamentoResponseDTO financiamento = financiamentoService.simular(new FinanciamentoRequestDTO(
                request.motoId(),
                request.valorReferencia(),
                request.valorEntrada(),
                request.prazoMeses(),
                request.taxaJurosFinanciamento()
        ));
        ConsorcioResponseDTO consorcio = consorcioService.simular(new ConsorcioRequestDTO(
                request.motoId(),
                request.valorReferencia(),
                request.prazoMeses(),
                request.taxaAdmConsorcio(),
                request.fundoReservaConsorcio(),
                request.seguroMensalConsorcio()
        ));

        BigDecimal diferencaCustoTotal = financiamento.totalPagoComEntrada()
                .subtract(consorcio.totalEstimadoPlano())
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal diferencaParcela = financiamento.valorParcela()
                .subtract(consorcio.valorParcelaEstimada())
                .setScale(2, RoundingMode.HALF_UP);

        String modalidadeMenorCusto = diferencaCustoTotal.signum() > 0
                ? "CONSORCIO"
                : diferencaCustoTotal.signum() < 0 ? "FINANCIAMENTO" : "CUSTOS_EQUIVALENTES";
        BigDecimal economiaEstimada = diferencaCustoTotal.abs();

        return new ComparacaoResponseDTO(
                financiamento,
                consorcio,
                diferencaCustoTotal,
                diferencaParcela,
                modalidadeMenorCusto,
                economiaEstimada
        );
    }
}
