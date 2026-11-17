package br.com.franca.simulador.controller;

import br.com.franca.simulador.dto.request.ComparacaoRequestDTO;
import br.com.franca.simulador.dto.request.ConsorcioRequestDTO;
import br.com.franca.simulador.dto.request.FinanciamentoRequestDTO;
import br.com.franca.simulador.dto.response.ComparacaoResponseDTO;
import br.com.franca.simulador.dto.response.ConfiguracaoSimulacaoDTO;
import br.com.franca.simulador.dto.response.ConsorcioResponseDTO;
import br.com.franca.simulador.dto.response.FinanciamentoResponseDTO;
import br.com.franca.simulador.service.ComparadorService;
import br.com.franca.simulador.service.ConsorcioService;
import br.com.franca.simulador.service.FinanciamentoService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulacoes")
public class SimulacaoController {

    private final FinanciamentoService financiamentoService;
    private final ConsorcioService consorcioService;
    private final ComparadorService comparadorService;

    @Value("${simulador.limites.prazo-minimo-meses:6}")
    private Integer prazoMinimoMeses;

    @Value("${simulador.limites.prazo-maximo-meses:72}")
    private Integer prazoMaximoMeses;

    public SimulacaoController(FinanciamentoService financiamentoService,
                               ConsorcioService consorcioService,
                               ComparadorService comparadorService) {
        this.financiamentoService = financiamentoService;
        this.consorcioService = consorcioService;
        this.comparadorService = comparadorService;
    }

    @GetMapping("/configuracao")
    public ResponseEntity<ConfiguracaoSimulacaoDTO> obterConfiguracao() {
        ConfiguracaoSimulacaoDTO config = new ConfiguracaoSimulacaoDTO(
                financiamentoService.getTaxaJurosMensalPadrao(),
                consorcioService.getTaxaAdmPadrao(),
                consorcioService.getFundoReservaPadrao(),
                prazoMinimoMeses,
                prazoMaximoMeses,
                List.of(12, 24, 36, 48, 60, 72),
                "Simulador didático para TCC. Os valores representam estimativas e projeções financeiras."
        );
        return ResponseEntity.ok(config);
    }

    @PostMapping("/financiamento")
    public ResponseEntity<FinanciamentoResponseDTO> simularFinanciamento(
            @Valid @RequestBody FinanciamentoRequestDTO request
    ) {
        FinanciamentoResponseDTO resultado = financiamentoService.simular(request);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/consorcio")
    public ResponseEntity<ConsorcioResponseDTO> simularConsorcio(
            @Valid @RequestBody ConsorcioRequestDTO request
    ) {
        ConsorcioResponseDTO resultado = consorcioService.simular(request);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/comparar")
    public ResponseEntity<ComparacaoResponseDTO> comparar(
            @Valid @RequestBody ComparacaoRequestDTO request
    ) {
        ComparacaoResponseDTO resultado = comparadorService.comparar(request);
        return ResponseEntity.ok(resultado);
    }
}
