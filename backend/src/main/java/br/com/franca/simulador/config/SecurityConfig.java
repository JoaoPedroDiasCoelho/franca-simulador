package br.com.franca.simulador.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import br.com.franca.simulador.repository.UsuarioRepository;
import br.com.franca.simulador.model.Usuario;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .httpBasic(basic -> {})
                .formLogin(form -> form.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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

            Usuario administrador = usuarioRepository.findById(username)
                    .orElseGet(() -> new Usuario(username, "", true, "ROLE_ADMIN"));
            administrador.setPassword(passwordEncoder.encode(password));
            administrador.setEnabled(true);
            administrador.setRole("ROLE_ADMIN");
            usuarioRepository.save(administrador);
        };
    }
}