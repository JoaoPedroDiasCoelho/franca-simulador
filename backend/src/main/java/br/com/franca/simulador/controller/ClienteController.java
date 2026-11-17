package br.com.franca.simulador.controller;

import br.com.franca.simulador.dto.request.SenhaClienteRequestDTO;
import br.com.franca.simulador.dto.request.SolicitarCadastroClienteRequestDTO;
import br.com.franca.simulador.dto.response.CadastroSolicitadoResponseDTO;
import br.com.franca.simulador.dto.response.ClienteAtualResponseDTO;
import br.com.franca.simulador.dto.response.ClienteConviteResponseDTO;
import br.com.franca.simulador.dto.response.MensagemResponseDTO;
import br.com.franca.simulador.repository.UsuarioRepository;
import br.com.franca.simulador.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
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
    public ResponseEntity<CadastroSolicitadoResponseDTO> cadastrar(
            @Valid @RequestBody SolicitarCadastroClienteRequestDTO dados
    ) {
        return ResponseEntity.accepted().body(clienteService.solicitarCadastro(dados));
    }

    @GetMapping("/confirmacao")
    public ClienteConviteResponseDTO validarConvite(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization
    ) {
        return clienteService.validarConvite(tokenBearer(authorization));
    }

    @PostMapping("/confirmacao")
    public MensagemResponseDTO concluirCadastro(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @Valid @RequestBody SenhaClienteRequestDTO dados
    ) {
        return clienteService.concluirCadastro(tokenBearer(authorization), dados);
    }

    @GetMapping("/me")
    public ClienteAtualResponseDTO contaAtual(Authentication authentication) {
        String usuario = authentication.getName();
        return new ClienteAtualResponseDTO(usuario, usuarioRepository.buscarNome(usuario));
    }

    private static String tokenBearer(String authorization) {
        if (!authorization.startsWith("Bearer ") || authorization.substring(7).isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token de cadastro invalido.");
        }
        return authorization.substring(7).trim();
    }
}
