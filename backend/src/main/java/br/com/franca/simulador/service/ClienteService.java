package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.SenhaClienteRequestDTO;
import br.com.franca.simulador.dto.request.SolicitarCadastroClienteRequestDTO;
import br.com.franca.simulador.dto.response.CadastroSolicitadoResponseDTO;
import br.com.franca.simulador.dto.response.ClienteConviteResponseDTO;
import br.com.franca.simulador.dto.response.MensagemResponseDTO;
import br.com.franca.simulador.repository.ClienteConviteRepository;
import br.com.franca.simulador.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

@Service
public class ClienteService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int TOKEN_MINUTES = 30;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClienteConviteRepository conviteRepository;
    private final EmailService emailService;
    private final String baseUrl;

    public ClienteService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            ClienteConviteRepository conviteRepository,
            EmailService emailService,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.conviteRepository = conviteRepository;
        this.emailService = emailService;
        this.baseUrl = baseUrl.replaceAll("/+$", "");
    }

    @Transactional
    public CadastroSolicitadoResponseDTO solicitarCadastro(SolicitarCadastroClienteRequestDTO dados) {
        String email = dados.email().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existe(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe uma conta com esse e-mail.");
        }

        byte[] tokenBytes = new byte[32];
        RANDOM.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        conviteRepository.salvarConvite(
                email,
                dados.nome().trim(),
                hashToken(token),
                Instant.now().plusSeconds(TOKEN_MINUTES * 60L)
        );

        String link = baseUrl + "/#/cliente/confirmacao?token=" + token;
        String idEnvio = emailService.enviarLinkDeCadastro(dados.nome().trim(), email, link);
        return new CadastroSolicitadoResponseDTO(
                "O SendPulse aceitou o envio do link de cadastro.",
                idEnvio
        );
    }

    public ClienteConviteResponseDTO validarConvite(String token) {
        var convite = conviteRepository.buscarConviteValido(hashToken(token))
                .orElseThrow(() -> conviteInvalido());
        return new ClienteConviteResponseDTO(convite.nome(), convite.email());
    }

    @Transactional
    public MensagemResponseDTO concluirCadastro(String token, SenhaClienteRequestDTO dados) {
        String tokenHash = hashToken(token);
        var convite = conviteRepository.buscarConviteValido(tokenHash)
                .orElseThrow(() -> conviteInvalido());

        if (usuarioRepository.existe(convite.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe uma conta com esse e-mail.");
        }

        usuarioRepository.criarCliente(
                convite.email(),
                convite.nome(),
                passwordEncoder.encode(dados.senha())
        );
        conviteRepository.removerConvite(convite.email(), tokenHash);
        return new MensagemResponseDTO("Senha cadastrada. Agora voce ja pode entrar na sua conta.");
    }

    private static String hashToken(String token) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 indisponivel", exception);
        }
    }

    private static ResponseStatusException conviteInvalido() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Este link de cadastro e invalido ou expirou. Solicite um novo."
        );
    }
}
