package br.com.franca.simulador.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record ConfiguracaoSimulacaoDTO(
        BigDecimal taxaJurosMensalPadrao,

        BigDecimal taxaAdmTotalPadrao,

        BigDecimal fundoReservaPadrao,

        Integer prazoMinimoMeses,

        Integer prazoMaximoMeses,

        List<Integer> prazosSugeridos,

        String avisoLegal
) {}
