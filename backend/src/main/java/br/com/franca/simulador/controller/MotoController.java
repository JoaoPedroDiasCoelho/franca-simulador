package br.com.franca.simulador.controller;

import br.com.franca.simulador.dto.request.MotoCadastroRequestDTO;
import br.com.franca.simulador.dto.response.MotoResponseDTO;
import br.com.franca.simulador.service.MotoService;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/motos")
public class MotoController {

    private final MotoService motoService;

    public MotoController(MotoService motoService) {
        this.motoService = motoService;
    }

    @GetMapping
    public ResponseEntity<List<MotoResponseDTO>> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) BigDecimal precoMin,
            @RequestParam(required = false) BigDecimal precoMax
    ) {
        List<MotoResponseDTO> motos = motoService.listarMotos(busca, categoria, precoMin, precoMax);
        return ResponseEntity.ok(motos);
    }

    @PostMapping
    public ResponseEntity<MotoResponseDTO> cadastrar(@Valid @RequestBody MotoCadastroRequestDTO dados) {
        MotoResponseDTO moto = motoService.cadastrarMoto(dados);
        return ResponseEntity.created(URI.create("/api/motos/" + moto.id())).body(moto);
    }

    @PostMapping(value = "/com-imagem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MotoResponseDTO> cadastrarComImagem(
            @Valid @RequestPart("dados") MotoCadastroRequestDTO dados,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ) {
        MotoResponseDTO moto = motoService.cadastrarMotoComImagem(dados, imagem);
        return ResponseEntity.created(URI.create("/api/motos/" + moto.id())).body(moto);
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> buscarImagem(@PathVariable Long id) {
        return motoService.buscarImagem(id)
                .map(imagem -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(imagem.tipoConteudo()))
                        .cacheControl(CacheControl.noCache())
                        .body(imagem.conteudo()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/admin-access")
    public ResponseEntity<Void> validarAcessoAdmin() {
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MotoResponseDTO> buscarPorId(
            @PathVariable Long id
    ) {
        MotoResponseDTO moto = motoService.buscarPorId(id);
        return ResponseEntity.ok(moto);
    }
}
