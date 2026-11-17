package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.UsuarioCadastroRequestDTO;
import br.com.franca.simulador.dto.response.UsuarioResponseDTO;
import br.com.franca.simulador.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponseDTO> listarAdministradores() {
        return usuarioRepository.listarAdministradores().stream()
                .map(UsuarioResponseDTO::new)
                .toList();
    }

    public UsuarioResponseDTO cadastrar(UsuarioCadastroRequestDTO dados) {
        String usuario = dados.usuario().trim();
        if (usuarioRepository.existe(usuario)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe um usuario com esse nome");
        }

        usuarioRepository.criarAdministrador(usuario, passwordEncoder.encode(dados.senha()));

        return new UsuarioResponseDTO(usuario);
    }
}
