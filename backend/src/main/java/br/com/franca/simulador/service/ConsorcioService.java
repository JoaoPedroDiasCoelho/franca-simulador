package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.ConsorcioRequestDTO;
import br.com.franca.simulador.dto.response.ConsorcioResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ConsorcioService {

    private final BigDecimal taxaAdmPadrao;
    private final BigDecimal fundoReservaPadrao;

    public ConsorcioService(
            @Value("${simulador.consorcio.taxa-adm-total-padrao:15.00}") BigDecimal taxaAdmPadrao,
            @Value("${simulador.consorcio.fundo-reserva-padrao:2.00}") BigDecimal fundoReservaPadrao) {
        this.taxaAdmPadrao = taxaAdmPadrao;
        this.fundoReservaPadrao = fundoReservaPadrao;
    }

    public BigDecimal getTaxaAdmPadrao() {
        return taxaAdmPadrao;
    }

    public BigDecimal getFundoReservaPadrao() {
        return fundoReservaPadrao;
    }

    public ConsorcioResponseDTO simular(ConsorcioRequestDTO request) {
        BigDecimal valorCarta = request.valorCarta().setScale(2, RoundingMode.HALF_UP);
        int prazo = request.prazoMeses();

        BigDecimal taxaAdm = request.taxaAdministrativaTotal() != null
                ? request.taxaAdministrativaTotal() : taxaAdmPadrao;
        BigDecimal fundoReserva = request.fundoReservaPercentual() != null
                ? request.fundoReservaPercentual() : fundoReservaPadrao;
        BigDecimal seguroMensal = request.seguroMensal() != null
                ? request.seguroMensal() : BigDecimal.ZERO;

        BigDecimal valorTaxaAdm = valorCarta.multiply(taxaAdm)
                .movePointLeft(2).setScale(2, RoundingMode.HALF_UP);
        BigDecimal valorFundoReserva = valorCarta.multiply(fundoReserva)
                .movePointLeft(2).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalSeguro = seguroMensal.multiply(BigDecimal.valueOf(prazo));
        BigDecimal totalEstimadoPlano = valorCarta.add(valorTaxaAdm)
                .add(valorFundoReserva).add(totalSeguro);
        BigDecimal valorParcelaEstimada = totalEstimadoPlano
                .divide(BigDecimal.valueOf(prazo), 2, RoundingMode.HALF_UP);

        return new ConsorcioResponseDTO(
                valorCarta,
                prazo,
                taxaAdm,
                valorTaxaAdm,
                fundoReserva,
                valorFundoReserva,
                seguroMensal,
                totalSeguro,
                totalEstimadoPlano,
                valorParcelaEstimada,
                "Estimativa sem juros. A contemplação depende de sorteio ou lance."
        );
    }
}
