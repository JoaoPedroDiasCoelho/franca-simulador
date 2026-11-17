package br.com.franca.simulador.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.http.HttpClient;
import java.time.Duration;

@Component
public class MathJsClient {

    private final RestClient restClient;
    private final String calculatorUrl;

    public MathJsClient(@Value("${simulador.financiamento.calculadora-url:https://api.mathjs.org/v4/}") String calculatorUrl) {
        var httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(5));

        this.restClient = RestClient.builder().requestFactory(requestFactory).build();
        this.calculatorUrl = calculatorUrl;
    }

    public BigDecimal calcularParcela(BigDecimal principal, BigDecimal taxaMensal, int prazoMeses) {
        String expression = criarExpressao(principal, taxaMensal, prazoMeses);
        MathJsResponse response;
        try {
            response = restClient.post()
                    .uri(calculatorUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new MathJsRequest(expression, 20))
                    .retrieve()
                    .body(MathJsResponse.class);
        } catch (RestClientException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "A API pública de cálculo está indisponível.", exception);
        }

        if (response == null || response.result() == null || response.error() != null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "A API pública não retornou um resultado válido.");
        }

        try {
            BigDecimal result = new BigDecimal(response.result());
            if (result.compareTo(BigDecimal.ZERO) < 0) {
                throw new NumberFormatException("O resultado não pode ser negativo.");
            }
            return result.setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "A API pública retornou um valor de parcela inválido.", exception);
        }
    }

    private String criarExpressao(BigDecimal principal, BigDecimal taxaMensal, int prazoMeses) {
        String principalDecimal = principal.toPlainString();
        if (taxaMensal.compareTo(BigDecimal.ZERO) == 0) {
            return "(" + principalDecimal + " / " + prazoMeses + ")";
        }

        String taxaDecimal = taxaMensal.toPlainString();
        return "(" + principalDecimal + " * (" + taxaDecimal + " / 100))"
                + " / (1 - 1 / (1 + (" + taxaDecimal + " / 100)) ^ " + prazoMeses + ")";
    }

    private record MathJsRequest(String expr, int precision) {}

    private record MathJsResponse(String result, String error) {}
}
