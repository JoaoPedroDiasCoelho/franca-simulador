package br.com.franca.simulador.controller;

import br.com.franca.simulador.dto.request.UsuarioCadastroRequestDTO;
import br.com.franca.simulador.dto.response.UsuarioResponseDTO;
import br.com.franca.simulador.service.AdminUsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUsuarioController {

    private final AdminUsuarioService adminUsuarioService;

    public AdminUsuarioController(AdminUsuarioService adminUsuarioService) {
        this.adminUsuarioService = adminUsuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {
        return ResponseEntity.ok(adminUsuarioService.listarAdministradores());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@Valid @RequestBody UsuarioCadastroRequestDTO dados) {
        UsuarioResponseDTO usuario = adminUsuarioService.cadastrar(dados);
        return ResponseEntity.created(URI.create("/api/admin/users")).body(usuario);
    }
}
