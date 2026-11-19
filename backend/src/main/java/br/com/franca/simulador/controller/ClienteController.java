package br.com.franca.simulador.controller;

import br.com.franca.simulador.dto.request.CadastroClienteRequestDTO;
import br.com.franca.simulador.dto.response.ClienteAtualResponseDTO;
import br.com.franca.simulador.repository.UsuarioRepository;
import br.com.franca.simulador.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final UsuarioRepository usuarioRepository;

    public ClienteController(ClienteService clienteService, UsuarioRepository usuarioRepository) {
        this.clienteService = clienteService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<ClienteAtualResponseDTO> cadastrar(
            @Valid @RequestBody CadastroClienteRequestDTO dados
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.cadastrar(dados));
    }

    @GetMapping("/me")
    public ClienteAtualResponseDTO contaAtual(Authentication authentication) {
        String usuario = authentication.getName();
        return usuarioRepository.findById(usuario)
                .map(conta -> new ClienteAtualResponseDTO(usuario, conta.nomeExibicao()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta nao encontrada."));
    }
}
