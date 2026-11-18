package br.com.franca.simulador.repository;

import br.com.franca.simulador.model.ClienteConvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface ClienteConviteRepository extends JpaRepository<ClienteConvite, String> {

    Optional<ClienteConvite> findByTokenHashAndExpiraEmAfter(String tokenHash, Instant agora);

    long deleteByEmailAndTokenHash(String email, String tokenHash);
}
