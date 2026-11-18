package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.SenhaClienteRequestDTO;
import br.com.franca.simulador.dto.request.SolicitarCadastroClienteRequestDTO;
import br.com.franca.simulador.dto.response.CadastroSolicitadoResponseDTO;
import br.com.franca.simulador.dto.response.ClienteConviteResponseDTO;
import br.com.franca.simulador.dto.response.MensagemResponseDTO;
import br.com.franca.simulador.model.ClienteConvite;
import br.com.franca.simulador.model.Usuario;
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
        if (usuarioRepository.existsByUsername(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe uma conta com esse e-mail.");
        }

        byte[] tokenBytes = new byte[32];
        RANDOM.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        String nome = dados.nome().trim();
        String tokenHash = hashToken(token);
        Instant expiraEm = Instant.now().plusSeconds(TOKEN_MINUTES * 60L);
        ClienteConvite convite = conviteRepository.findById(email)
                .map(existente -> {
                    existente.atualizar(nome, tokenHash, expiraEm);
                    return existente;
                })
                .orElseGet(() -> new ClienteConvite(email, nome, tokenHash, expiraEm));
        conviteRepository.save(convite);

        String link = baseUrl + "/#/cliente/confirmacao?token=" + token;
        emailService.enviarLinkDeCadastro(dados.nome().trim(), email, link);
        return new CadastroSolicitadoResponseDTO(
                "A solicitacao de envio do link de cadastro foi enviada ao Gmail."
        );
    }

    public ClienteConviteResponseDTO validarConvite(String token) {
        var convite = conviteRepository.findByTokenHashAndExpiraEmAfter(hashToken(token), Instant.now())
                .orElseThrow(() -> conviteInvalido());
        return new ClienteConviteResponseDTO(convite.getNome(), convite.getEmail());
    }

    @Transactional
    public MensagemResponseDTO concluirCadastro(String token, SenhaClienteRequestDTO dados) {
        String tokenHash = hashToken(token);
        var convite = conviteRepository.findByTokenHashAndExpiraEmAfter(tokenHash, Instant.now())
                .orElseThrow(() -> conviteInvalido());

        if (usuarioRepository.existsByUsername(convite.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe uma conta com esse e-mail.");
        }

        usuarioRepository.save(Usuario.cliente(
                convite.getEmail(),
                convite.getNome(),
                passwordEncoder.encode(dados.senha())
        ));
        conviteRepository.deleteByEmailAndTokenHash(convite.getEmail(), tokenHash);
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
