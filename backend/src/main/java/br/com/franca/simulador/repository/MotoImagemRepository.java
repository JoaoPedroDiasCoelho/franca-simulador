package br.com.franca.simulador.repository;

import br.com.franca.simulador.model.MotoImagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MotoImagemRepository extends JpaRepository<MotoImagem, Long> {
}
