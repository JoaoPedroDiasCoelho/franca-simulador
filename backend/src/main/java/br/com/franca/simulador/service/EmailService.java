package br.com.franca.simulador.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String gmailUsername;
    private final String appPassword;

    public EmailService(
            @Value("${GMAIL_USERNAME:}") String gmailUsername,
            @Value("${GMAIL_APP_PASSWORD:}") String appPassword
    ) {
        this.gmailUsername = gmailUsername;
        this.appPassword = appPassword;
        this.mailSender = criarMailSender(gmailUsername, appPassword);
    }

    public void enviarLinkDeCadastro(String nome, String email, String link) {
        if (gmailUsername.isBlank() || appPassword.isBlank()) {
            logger.error("Gmail SMTP is not configured: GMAIL_USERNAME or GMAIL_APP_PASSWORD is empty.");
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
            logger.error("Could not prepare registration email for Gmail SMTP.", exception);
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Nao foi possivel preparar o e-mail de cadastro.",
                    exception
            );
        } catch (MailException exception) {
            logger.error("Gmail SMTP failed to send the registration email.", exception);
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

    private static JavaMailSender criarMailSender(String username, String appPassword) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("smtp.gmail.com");
        sender.setPort(587);
        sender.setUsername(username);
        sender.setPassword(appPassword.replaceAll("\\s", ""));
        sender.setDefaultEncoding(StandardCharsets.UTF_8.name());

        Properties properties = sender.getJavaMailProperties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.starttls.required", "true");
        properties.put("mail.smtp.connectiontimeout", "5000");
        properties.put("mail.smtp.timeout", "10000");
        properties.put("mail.smtp.writetimeout", "10000");
        return sender;
    }
}
