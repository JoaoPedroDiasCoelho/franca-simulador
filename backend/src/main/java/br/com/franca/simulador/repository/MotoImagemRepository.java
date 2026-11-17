package br.com.franca.simulador.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class MotoImagemRepository {

    private final JdbcTemplate jdbcTemplate;

    public MotoImagemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void salvar(Long motoId, byte[] conteudo, String tipoConteudo) {
        jdbcTemplate.update(
                "INSERT INTO moto_imagens (moto_id, conteudo, tipo_conteudo) " +
                        "VALUES (?, ?, ?) ON CONFLICT (moto_id) DO UPDATE SET " +
                        "conteudo = EXCLUDED.conteudo, tipo_conteudo = EXCLUDED.tipo_conteudo, " +
                        "atualizado_em = CURRENT_TIMESTAMP",
                motoId, conteudo, tipoConteudo
        );
    }

    public void excluirPorMotoId(Long motoId) {
        jdbcTemplate.update("DELETE FROM moto_imagens WHERE moto_id = ?", motoId);
    }

    public Optional<Imagem> buscarPorMotoId(Long motoId) {
        List<Imagem> imagens = jdbcTemplate.query(
                "SELECT conteudo, tipo_conteudo FROM moto_imagens WHERE moto_id = ?",
                (resultado, linha) -> new Imagem(
                        resultado.getBytes("conteudo"),
                        resultado.getString("tipo_conteudo")
                ),
                motoId
        );
        return imagens.stream().findFirst();
    }

    public record Imagem(byte[] conteudo, String tipoConteudo) {}
}
