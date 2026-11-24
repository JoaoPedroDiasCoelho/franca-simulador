import { useState } from 'react';
import { api } from '../api.js';
import Field from '../components/Field.jsx';
import Brand from '../components/Brand.jsx';
import { routeHref } from '../utils/routes.js';

export default function ClientAccessPage({ onSuccess }) {
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [credentials, setCredentials] = useState({ usuario: '', senha: '' });
  const [registration, setRegistration] = useState({ nome: '', email: '', senha: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setEmailError('');
    setBusy(true);
    try {
      if (creatingAccount) {
        if (registration.senha !== confirmPassword) {
          setMessage('As senhas não conferem.');
          return;
        }
        const client = await api.cadastrarCliente(registration);
        onSuccess({
          usuario: client.usuario,
          senha: registration.senha,
          nome: client.nome || registration.nome
        });
      } else {
        const client = await api.getCliente(credentials);
        onSuccess({ ...credentials, nome: client.nome || client.usuario });
      }
    } catch (error) {
      if (creatingAccount && error.status === 409 && /e-mail|email/i.test(error.message)) {
        setEmailError('Este e-mail j\u00e1 est\u00e1 cadastrado. Informe outro e-mail ou entre na sua conta.');
      } else {
      setMessage(error.status === 401 || error.status === 403
        ? 'Usuário ou senha inválidos.'
        : error.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return <main className="client-access">
    <section className="client-access-visual">
      <img src="/assets/admin-motorcycle.webp" alt="" />
      <div className="client-access-shade" />
      <div className="client-access-brand"><Brand onDark /></div>
      <div className="client-access-story">
        <span className="eyebrow eyebrow-light"><i /> SUA PRÓXIMA ROTA COMEÇA AQUI</span>
        <h1>Escolha sua moto.<br /><em>Planeje seu caminho.</em></h1>
        <p>Compare financiamento e consórcio com clareza e encontre o plano que combina com você.</p>
        <div className="client-access-perks">
          <span><b>01</b> Simule parcelas</span>
          <span><b>02</b> Compare opções</span>
          <span><b>03</b> Decida com calma</span>
        </div>
      </div>
      <small className="client-access-caption">FRANÇA SIMULADOR <i /> LIBERDADE EM DUAS RODAS</small>
    </section>

    <section className="client-access-panel">
      <a className="client-back-link" href={routeHref('motos')}>
        <span aria-hidden="true">←</span> Voltar ao catálogo
      </a>
      <div className="client-auth-card">
        <span className="client-auth-icon" aria-hidden="true">{creatingAccount ? '＋' : '↗'}</span>
        <span className="eyebrow">{creatingAccount ? 'COMECE POR AQUI' : 'ÁREA DO CLIENTE'}</span>
        <h2>{creatingAccount
          ? <>Sua próxima aventura<br />começa com uma conta.</>
          : <>Bom ter você<br />de volta.</>}</h2>
        <p className="client-auth-description">
          {creatingAccount
            ? 'Informe seu nome, e-mail e senha para criar sua conta.'
            : 'Entre na sua conta para continuar sua simulação.'}
        </p>

        <form onSubmit={submit}>
          {creatingAccount ? <>
            <Field label="Nome completo">
              <input
                autoComplete="name"
                maxLength="150"
                placeholder="Como podemos te chamar?"
                required
                value={registration.nome}
                onChange={(event) => setRegistration({ ...registration, nome: event.target.value })}
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                autoComplete="email"
                maxLength="254"
                placeholder="voce@exemplo.com"
                required
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'client-email-error' : undefined}
                value={registration.email}
                onChange={(event) => {
                  setRegistration({ ...registration, email: event.target.value });
                  setEmailError('');
                }}
              />
              {emailError && <span id="client-email-error" className="client-auth-field-error" role="alert">{emailError}</span>}
            </Field>
            <Field label="Senha">
              <input
                type="password"
                autoComplete="new-password"
                minLength="8"
                maxLength="72"
                placeholder="Mínimo de 8 caracteres"
                required
                value={registration.senha}
                onChange={(event) => setRegistration({ ...registration, senha: event.target.value })}
              />
            </Field>
            <Field label="Confirme sua senha">
              <input
                type="password"
                autoComplete="new-password"
                minLength="8"
                maxLength="72"
                placeholder="Digite a senha novamente"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Field>
          </> : <>
            <Field label="E-mail">
              <input
                autoComplete="username"
                maxLength="254"
                placeholder="Seu e-mail"
                required
                value={credentials.usuario}
                onChange={(event) => setCredentials({ ...credentials, usuario: event.target.value })}
              />
            </Field>
            <Field label="Senha">
              <input
                type="password"
                autoComplete="current-password"
                maxLength="72"
                placeholder="Sua senha"
                required
                value={credentials.senha}
                onChange={(event) => setCredentials({ ...credentials, senha: event.target.value })}
              />
            </Field>
          </>}
          {message && <p className="client-auth-error" role="alert">{message}</p>}
          <button className="button button-red button-wide client-auth-submit" disabled={busy}>
            {busy ? 'Aguarde…' : creatingAccount ? 'Criar minha conta' : 'Entrar na minha conta'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>

        <div className="client-auth-divider"><span>OU</span></div>
        <p className="client-auth-switch">
          {creatingAccount ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
          <button
            type="button"
            onClick={() => {
              setCreatingAccount(!creatingAccount);
              setMessage('');
              setEmailError('');
            }}
          >
            {creatingAccount ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
        <p className="client-auth-footnote"><span aria-hidden="true">▣</span> Seus dados são protegidos e usados apenas para acessar sua conta.</p>
      </div>
    </section>
  </main>;
}
