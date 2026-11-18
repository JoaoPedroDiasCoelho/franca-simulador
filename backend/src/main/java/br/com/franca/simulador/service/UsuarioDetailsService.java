package br.com.franca.simulador.service;

import br.com.franca.simulador.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));

        return User.withUsername(usuario.getUsername())
                .password(usuario.getPassword())
                .disabled(!usuario.isEnabled())
                .authorities(usuario.getRole())
                .build();
    }
}
