package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.response.MotoResponseDTO;
import br.com.franca.simulador.dto.request.MotoCadastroRequestDTO;
import br.com.franca.simulador.model.Moto;
import br.com.franca.simulador.model.MotoImagem;
import br.com.franca.simulador.repository.MotoImagemRepository;
import br.com.franca.simulador.repository.MotoRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class MotoService {

    private static final Set<String> TIPOS_IMAGEM = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private final MotoRepository motoRepository;
    private final MotoImagemRepository motoImagemRepository;

    public MotoService(MotoRepository motoRepository, MotoImagemRepository motoImagemRepository) {
        this.motoRepository = motoRepository;
        this.motoImagemRepository = motoImagemRepository;
    }

    @Transactional
    public MotoResponseDTO cadastrarMoto(MotoCadastroRequestDTO dados) {
        Moto moto = new Moto(
                null,
                dados.marca().trim(),
                dados.modelo().trim(),
                dados.categoria().trim(),
                dados.cilindrada(),
                dados.anoModelo(),
                dados.preco(),
                limparOpcional(dados.imagemUrl()),
                limparOpcional(dados.descricao()),
                true
        );
        return MotoResponseDTO.fromEntity(motoRepository.save(moto));
    }

    @Transactional
    public MotoResponseDTO cadastrarMotoComImagem(MotoCadastroRequestDTO dados, MultipartFile arquivo) {
        ImagemEnviada imagem = lerImagem(arquivo);

        Moto moto = new Moto(
                null,
                dados.marca().trim(),
                dados.modelo().trim(),
                dados.categoria().trim(),
                dados.cilindrada(),
                dados.anoModelo(),
                dados.preco(),
                imagem == null ? limparOpcional(dados.imagemUrl()) : null,
                limparOpcional(dados.descricao()),
                true
        );
        moto = motoRepository.save(moto);

        if (imagem != null) {
            moto.setImagemUrl("/api/motos/" + moto.getId() + "/imagem");
            moto = motoRepository.save(moto);
            motoImagemRepository.save(new MotoImagem(moto.getId(), imagem.conteudo(), imagem.tipoConteudo()));
        }

        return MotoResponseDTO.fromEntity(moto);
    }

    @Transactional
    public MotoResponseDTO atualizarMoto(Long id, MotoCadastroRequestDTO dados, MultipartFile arquivo) {
        Moto moto = motoRepository.findByIdAndAtivaTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Motocicleta com ID " + id + " não encontrada no catálogo"));
        ImagemEnviada imagem = lerImagem(arquivo);

        moto.setMarca(dados.marca().trim());
        moto.setModelo(dados.modelo().trim());
        moto.setCategoria(dados.categoria().trim());
        moto.setCilindrada(dados.cilindrada());
        moto.setAnoModelo(dados.anoModelo());
        moto.setPreco(dados.preco());
        moto.setDescricao(limparOpcional(dados.descricao()));

        if (imagem != null) {
            moto.setImagemUrl("/api/motos/" + moto.getId() + "/imagem");
        } else {
            String imagemUrl = limparOpcional(dados.imagemUrl());
            moto.setImagemUrl(imagemUrl);
            if (!("/api/motos/" + moto.getId() + "/imagem").equals(imagemUrl)) {
                motoImagemRepository.deleteById(moto.getId());
            }
        }

        moto = motoRepository.save(moto);
        if (imagem != null) {
            motoImagemRepository.save(new MotoImagem(moto.getId(), imagem.conteudo(), imagem.tipoConteudo()));
        }

        return MotoResponseDTO.fromEntity(moto);
    }

    @Transactional(readOnly = true)
    public Optional<ImagemMoto> buscarImagem(Long id) {
        if (motoRepository.findByIdAndAtivaTrue(id).isEmpty()) {
            return Optional.empty();
        }

        return motoImagemRepository.findById(id)
                .map(imagem -> new ImagemMoto(imagem.getConteudo(), imagem.getTipoConteudo()));
    }

    @Transactional
    public void excluirMoto(Long id) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Motocicleta com ID " + id + " não encontrada no catálogo"));
        motoImagemRepository.deleteById(id);
        motoRepository.delete(moto);
    }

    private ImagemEnviada lerImagem(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            return null;
        }

        String tipoConteudo = arquivo.getContentType();
        if (tipoConteudo == null || !TIPOS_IMAGEM.contains(tipoConteudo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie uma imagem JPEG, PNG, WebP ou GIF.");
        }

        try {
            return new ImagemEnviada(arquivo.getBytes(), tipoConteudo);
        } catch (IOException erro) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não foi possível ler a imagem enviada.");
        }
    }

    private record ImagemEnviada(byte[] conteudo, String tipoConteudo) {}

    public record ImagemMoto(byte[] conteudo, String tipoConteudo) {}

    private String limparOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    @Transactional(readOnly = true)
    public List<MotoResponseDTO> listarMotos(String busca, String categoria, BigDecimal precoMin, BigDecimal precoMax) {
        Specification<Moto> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Apenas motocicletas ativas
            predicates.add(cb.isTrue(root.get("ativa")));

            // Filtro textual por marca, modelo ou categoria
            if (busca != null && !busca.trim().isEmpty()) {
                String likePattern = "%" + busca.trim().toLowerCase() + "%";
                Predicate marcaMatch = cb.like(cb.lower(root.get("marca")), likePattern);
                Predicate modeloMatch = cb.like(cb.lower(root.get("modelo")), likePattern);
                Predicate categoriaMatch = cb.like(cb.lower(root.get("categoria")), likePattern);
                predicates.add(cb.or(marcaMatch, modeloMatch, categoriaMatch));
            }

            // Filtro específico por categoria
            if (categoria != null && !categoria.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("categoria")), categoria.trim().toLowerCase()));
            }

            // Faixa de preço
            if (precoMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("preco"), precoMin));
            }
            if (precoMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("preco"), precoMax));
            }

            if (query != null) {
                query.orderBy(cb.asc(root.get("preco")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return motoRepository.findAll(spec)
                .stream()
                .map(MotoResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public MotoResponseDTO buscarPorId(Long id) {
        Moto moto = motoRepository.findByIdAndAtivaTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Motocicleta com ID " + id + " não encontrada no catálogo"));
        return MotoResponseDTO.fromEntity(moto);
    }
}
