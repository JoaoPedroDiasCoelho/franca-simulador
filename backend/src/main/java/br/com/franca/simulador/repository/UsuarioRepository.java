package br.com.franca.simulador.repository;

import br.com.franca.simulador.model.Usuario;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    List<Usuario> findByRoleOrderByUsername(String role);

    Optional<Usuario> findByUsernameAndRole(String username, String role);

    boolean existsByUsername(String username);

    boolean existsByEmailIgnoreCase(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select usuario from Usuario usuario where usuario.role = :role and usuario.enabled = true")
    List<Usuario> findEnabledByRoleForUpdate(@Param("role") String role);
}
