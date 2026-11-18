package br.com.franca.simulador.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String gmailUsername;
    private final String appPassword;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${GMAIL_USERNAME:}") String gmailUsername,
            @Value("${GMAIL_APP_PASSWORD:}") String appPassword
    ) {
        this.mailSender = mailSender;
        this.gmailUsername = gmailUsername;
        this.appPassword = appPassword;
    }

    public void enviarLinkDeCadastro(String nome, String email, String link) {
        if (gmailUsername.isBlank() || appPassword.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Configure GMAIL_USERNAME e GMAIL_APP_PASSWORD para enviar e-mails."
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
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );
            helper.setFrom(gmailUsername, "França Simulador");
            helper.setTo(email);
            helper.setSubject("Complete seu cadastro no França Simulador");
            helper.setText(text, html);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Nao foi possivel preparar o e-mail de cadastro.",
                    exception
            );
        } catch (MailException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gmail recusou o envio. Confira o usuario, a senha de app e as configuracoes SMTP.",
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
}
