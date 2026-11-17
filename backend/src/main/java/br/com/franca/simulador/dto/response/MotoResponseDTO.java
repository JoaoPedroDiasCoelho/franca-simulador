package br.com.franca.simulador.dto.response;

import br.com.franca.simulador.model.Moto;

import java.math.BigDecimal;

public record MotoResponseDTO(
        Long id,

        String marca,

        String modelo,

        String categoria,

        Integer cilindrada,

        Integer anoModelo,

        BigDecimal preco,

        String imagemUrl,

        String descricao
) {
    public static MotoResponseDTO fromEntity(Moto moto) {
        return new MotoResponseDTO(
                moto.getId(),
                moto.getMarca(),
                moto.getModelo(),
                moto.getCategoria(),
                moto.getCilindrada(),
                moto.getAnoModelo(),
                moto.getPreco(),
                moto.getImagemUrl(),
                moto.getDescricao()
        );
    }
}
