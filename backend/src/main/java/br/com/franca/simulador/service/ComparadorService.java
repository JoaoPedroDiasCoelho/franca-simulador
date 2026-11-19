package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.ComparacaoRequestDTO;
import br.com.franca.simulador.dto.request.ConsorcioRequestDTO;
import br.com.franca.simulador.dto.request.FinanciamentoRequestDTO;
import br.com.franca.simulador.dto.response.ComparacaoResponseDTO;
import br.com.franca.simulador.dto.response.ConsorcioResponseDTO;
import br.com.franca.simulador.dto.response.FinanciamentoResponseDTO;
import br.com.franca.simulador.domain.comparacao.ResultadoComparacao;
import org.springframework.stereotype.Service;


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

        ResultadoComparacao comparacao = ResultadoComparacao.entre(
                financiamento.totalPagoComEntrada(), financiamento.valorParcela(),
                consorcio.totalEstimadoPlano(), consorcio.valorParcelaEstimada());

        return new ComparacaoResponseDTO(
                financiamento,
                consorcio,
                comparacao.diferencaCustoTotal(),
                comparacao.diferencaParcela(),
                comparacao.modalidadeMenorCusto(),
                comparacao.economiaEstimada()
        );
    }
}
