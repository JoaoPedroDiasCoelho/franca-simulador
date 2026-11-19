package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.CadastroClienteRequestDTO;
import br.com.franca.simulador.dto.response.ClienteAtualResponseDTO;
import br.com.franca.simulador.model.Usuario;
import br.com.franca.simulador.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class ClienteService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ClienteAtualResponseDTO cadastrar(CadastroClienteRequestDTO dados) {
        String email = dados.email().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByUsername(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe uma conta com esse e-mail.");
        }

        Usuario cliente = usuarioRepository.save(Usuario.cliente(
                email,
                dados.nome().trim(),
                passwordEncoder.encode(dados.senha())
        ));
        return new ClienteAtualResponseDTO(cliente.getUsername(), cliente.nomeExibicao());
    }
}
