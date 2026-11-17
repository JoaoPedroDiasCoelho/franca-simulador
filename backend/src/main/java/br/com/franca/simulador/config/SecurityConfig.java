package br.com.franca.simulador.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import br.com.franca.simulador.repository.UsuarioRepository;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .httpBasic(Customizer.withDefaults())
                .formLogin(form -> form.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/clientes/confirmacao").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clientes/confirmacao").permitAll()
                        .requestMatchers("/api/clientes/me", "/api/simulacoes/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/api/motos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/motos/com-imagem").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/motos/admin-access").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().permitAll());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ApplicationRunner configureAdminUser(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_USERNAME:admin}") String username,
            @Value("${ADMIN_PASSWORD:}") String password
    ) {
        return args -> {
            if (password.isBlank()) {
                return;
            }
            if (username.isBlank() || username.length() > 50) {
                throw new IllegalStateException("ADMIN_USERNAME deve ter entre 1 e 50 caracteres");
            }

            usuarioRepository.salvarAdministradorConfigurado(
                    username,
                    passwordEncoder.encode(password)
            );
        };
    }
}
