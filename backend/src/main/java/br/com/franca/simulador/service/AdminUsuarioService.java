package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.UsuarioCadastroRequestDTO;
import br.com.franca.simulador.dto.response.UsuarioResponseDTO;
import br.com.franca.simulador.model.Usuario;
import br.com.franca.simulador.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminUsuarioService {

    private static final String ROLE_ADMIN = "ROLE_ADMIN";
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
        return usuarioRepository.findByRoleOrderByUsername(ROLE_ADMIN).stream()
                .map(usuario -> new UsuarioResponseDTO(usuario.getUsername()))
                .toList();
    }

    public UsuarioResponseDTO cadastrar(UsuarioCadastroRequestDTO dados) {
        String usuario = dados.usuario().trim();
        if (usuarioRepository.existsByUsername(usuario)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe um usuario com esse nome");
        }

        usuarioRepository.save(new Usuario(
                usuario,
                passwordEncoder.encode(dados.senha()),
                true,
                ROLE_ADMIN
        ));

        return new UsuarioResponseDTO(usuario);
    }

    @Transactional
    public void excluir(String username, String usuarioAutenticado) {
        if (username.equals(usuarioAutenticado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nao e permitido excluir o usuario autenticado.");
        }

        List<Usuario> administradoresAtivos = usuarioRepository.findEnabledByRoleForUpdate(ROLE_ADMIN);
        Usuario usuario = usuarioRepository.findByUsernameAndRole(username, ROLE_ADMIN)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado."));

        if (usuario.isEnabled() && administradoresAtivos.size() <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O ultimo administrador nao pode ser excluido.");
        }

        usuarioRepository.delete(usuario);
    }
}
