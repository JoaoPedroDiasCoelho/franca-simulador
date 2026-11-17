package br.com.franca.simulador.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.List;

@Service
public class EmailService {

    private final RestClient restClient;
    private final String apiKey;
    private final String remetente;

    public EmailService(
            @Value("${SENDPULSE_API_KEY:}") String apiKey,
            @Value("${SENDPULSE_FROM:}") String remetente
    ) {
        var httpClient = java.net.http.HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(10));

        this.restClient = RestClient.builder()
                .baseUrl("https://api.sendpulse.com")
                .requestFactory(requestFactory)
                .build();
        this.apiKey = apiKey;
        this.remetente = remetente;
    }

    public String enviarLinkDeCadastro(String nome, String email, String link) {
        if (apiKey.isBlank() || remetente.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Configure SENDPULSE_API_KEY e SENDPULSE_FROM para enviar e-mails."
            );
        }

        String text = """
                Ola, %s!

                Para concluir seu cadastro e criar sua senha, acesse este link:
                %s

                O link expira em 30 minutos e pode ser usado uma unica vez.
                Se voce nao solicitou o cadastro, ignore esta mensagem.
                """.formatted(nome, link);
        String html = """
                <p>Ola, %s!</p>
                <p>Para concluir seu cadastro e criar sua senha, acesse o link abaixo:</p>
                <p><a href="%s">Criar minha senha</a></p>
                <p>O link expira em 30 minutos e pode ser usado uma unica vez.</p>
                <p>Se voce nao solicitou o cadastro, ignore esta mensagem.</p>
                """.formatted(escaparHtml(nome), escaparHtml(link));
        String htmlBase64 = Base64.getEncoder()
                .encodeToString(html.getBytes(StandardCharsets.UTF_8));

        var emailRequest = new EmailRequest(new EmailContent(
                htmlBase64,
                text,
                "Complete seu cadastro no França Simulador",
                new Sender("França Simulador", remetente),
                List.of(new Recipient(nome, email))
        ));

        try {
            SendPulseResponse response = restClient.post()
                    .uri("/smtp/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(emailRequest)
                    .retrieve()
                    .body(SendPulseResponse.class);

            if (response == null || !response.result() || response.id() == null || response.id().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "A API do SendPulse nao confirmou o envio com um ID de mensagem."
                );
            }
            return response.id();
        } catch (RestClientResponseException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "SendPulse recusou o envio (HTTP %d). Confira a chave da API e se o remetente esta verificado."
                            .formatted(exception.getStatusCode().value()),
                    exception
            );
        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Nao foi possivel conectar a API do SendPulse.",
                    exception
            );
        }
    }

    private static String escaparHtml(String valor) {
        return valor.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private record EmailRequest(EmailContent email) {}

    private record EmailContent(
            String html,
            String text,
            String subject,
            Sender from,
            List<Recipient> to
    ) {}

    private record Sender(String name, String email) {}

    private record Recipient(String name, String email) {}

    private record SendPulseResponse(boolean result, String id) {}
}
