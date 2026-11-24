package br.com.franca.simulador.service;

import br.com.franca.simulador.dto.request.UsuarioCadastroRequestDTO;
import br.com.franca.simulador.dto.response.UsuarioResponseDTO;
import br.com.franca.simulador.exception.RegraDeNegocioException;
import br.com.franca.simulador.model.Usuario;
import br.com.franca.simulador.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

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
        return usuarioRepository.findByRoleOrderByUsername(Usuario.ROLE_ADMIN).stream()
                .map(usuario -> new UsuarioResponseDTO(usuario.getUsername()))
                .toList();
    }

    public UsuarioResponseDTO cadastrar(UsuarioCadastroRequestDTO dados) {
        String usuario = dados.usuario().trim();
        if (usuarioRepository.existsByUsername(usuario)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe um usuario com esse nome");
        }

        String email = dados.email().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe uma conta com esse e-mail.");
        }
        usuarioRepository.save(Usuario.administrador(
                usuario,
                email,
                dados.nome().trim(),
                passwordEncoder.encode(dados.senha())
        ));

        return new UsuarioResponseDTO(usuario);
    }

    @Transactional
    public void excluir(String username, String usuarioAutenticado) {
        List<Usuario> administradoresAtivos = usuarioRepository.findEnabledByRoleForUpdate(Usuario.ROLE_ADMIN);
        Usuario usuario = usuarioRepository.findByUsernameAndRole(username, Usuario.ROLE_ADMIN)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado."));

        try {
            usuario.validarExclusaoPor(usuarioAutenticado, administradoresAtivos.size());
        } catch (RegraDeNegocioException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, exception.getMessage(), exception);
        }

        usuarioRepository.delete(usuario);
    }
}
