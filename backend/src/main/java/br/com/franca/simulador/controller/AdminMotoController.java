package br.com.franca.simulador.controller;

import br.com.franca.simulador.dto.request.MotoCadastroRequestDTO;
import br.com.franca.simulador.dto.response.MotoResponseDTO;
import br.com.franca.simulador.service.MotoService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/motos")
public class AdminMotoController {

    private final MotoService motoService;

    public AdminMotoController(MotoService motoService) {
        this.motoService = motoService;
    }

    @GetMapping
    public ResponseEntity<List<MotoResponseDTO>> listar() {
        return ResponseEntity.ok(motoService.listarMotos(null, null, null, null));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MotoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestPart("dados") MotoCadastroRequestDTO dados,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ) {
        return ResponseEntity.ok(motoService.atualizarMoto(id, dados, imagem));
    }
}
