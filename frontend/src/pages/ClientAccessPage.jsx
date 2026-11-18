import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Field from '../components/Field.jsx';
import Brand from '../components/Brand.jsx';
import { routeHref } from '../utils/routes.js';

export default function ClientAccessPage({ onSuccess, confirmationPage = false, confirmationToken = '' }) {
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [credentials, setCredentials] = useState({ usuario: '', senha: '' });
  const [registration, setRegistration] = useState({ nome: '', email: '' });
  const [confirmation, setConfirmation] = useState(null);
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkingToken, setCheckingToken] = useState(confirmationPage);

  useEffect(() => {
    if (!confirmationPage) return undefined;
    if (!confirmationToken) {
      setMessage('Este link não contém um token válido. Solicite um novo.');
      setCheckingToken(false);
      return undefined;
    }
    let active = true;
    setCheckingToken(true);
    api.validarConviteCliente(confirmationToken)
      .then((data) => {
        if (active) setConfirmation(data);
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setCheckingToken(false);
      });
    return () => { active = false; };
  }, [confirmationPage, confirmationToken]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setBusy(true);
    try {
      if (confirmationToken) {
        if (confirmationPassword !== confirmPassword) {
          setMessage('As senhas não conferem.');
          return;
        }
        await api.concluirCadastroCliente(confirmationToken, confirmationPassword);
        setAccountCreated(true);
      } else if (creatingAccount) {
        await api.solicitarCadastroCliente(registration);
        setEmailSent(true);
      } else {
        const client = await api.getCliente(credentials);
        onSuccess({ ...credentials, nome: client.nome || client.usuario });
      }
    } catch (error) {
      setMessage(error.status === 401 || error.status === 403
        ? confirmationToken
          ? error.message
          : 'Usuário ou senha inválidos.'
        : error.message);
    } finally {
      setBusy(false);
    }
  };

  const isConfirmation = confirmationPage || Boolean(confirmationToken);
  const title = accountCreated
    ? <>Sua conta está<br />pronta para rodar.</>
    : isConfirmation
      ? <>Só falta definir<br />sua senha.</>
      : emailSent
        ? <>Confira seu<br />e-mail.</>
        : creatingAccount
          ? <>Sua próxima aventura<br />começa com uma conta.</>
          : <>Bom ter você<br />de volta.</>;
  const eyebrow = isConfirmation
    ? 'CONFIRMAÇÃO DE CADASTRO'
    : creatingAccount
      ? 'COMECE POR AQUI'
      : 'ÁREA DO CLIENTE';

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
        <span className="client-auth-icon" aria-hidden="true">{isConfirmation ? '✓' : creatingAccount ? '＋' : '↗'}</span>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p className="client-auth-description">
          {accountCreated
            ? 'Sua senha foi cadastrada com segurança. Agora entre com seu e-mail e senha.'
            : isConfirmation
              ? confirmation
                ? `Olá, ${confirmation.nome}. Crie uma senha para acessar sua conta.`
                : 'Estamos validando seu link de cadastro.'
              : emailSent
                ? `O link foi enviado para ${registration.email}. A entrega pode levar alguns instantes; ele expira em 30 minutos.`
                : creatingAccount
                  ? 'Informe seu nome e e-mail. Vamos enviar um link para você criar sua senha.'
                  : 'Entre na sua conta para continuar sua simulação.'}
        </p>

        {checkingToken && <p className="client-auth-success" role="status">Validando seu link…</p>}
        {!checkingToken && accountCreated && <div className="client-auth-success" role="status">
          <a className="button button-red button-wide client-auth-submit" href={routeHref('cliente')}>
            Entrar na minha conta <span aria-hidden="true">↗</span>
          </a>
        </div>}
        {!checkingToken && emailSent && <div className="client-auth-success" role="status">
          <p>Confira a caixa de entrada e a pasta de spam. Se não encontrar o link, solicite um novo cadastro.</p>
          <button className="button button-outline-dark button-wide client-auth-submit" type="button" onClick={() => {
            setEmailSent(false);
            setCreatingAccount(false);
          }}>
            Voltar para entrar
          </button>
        </div>}
        {!checkingToken && isConfirmation && !confirmation && message && <div className="client-auth-error" role="alert">
          {message}
          <a className="client-auth-retry" href={routeHref('cliente')}>Solicitar novo link</a>
        </div>}

        {!checkingToken && !emailSent && !accountCreated && (!isConfirmation || confirmation) && <form onSubmit={submit}>
          {isConfirmation ? <>
            <Field label="Nova senha">
              <input
                type="password"
                autoComplete="new-password"
                minLength="8"
                maxLength="72"
                placeholder="Mínimo de 8 caracteres"
                required
                value={confirmationPassword}
                onChange={(event) => setConfirmationPassword(event.target.value)}
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
          </> : creatingAccount ? <>
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
                value={registration.email}
                onChange={(event) => setRegistration({ ...registration, email: event.target.value })}
              />
            </Field>
          </> : <>
            <Field label="E-mail ou usuário">
              <input
                autoComplete="username"
                maxLength="254"
                placeholder="Seu e-mail ou usuário"
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
          {message && !(!confirmation && isConfirmation) && <p className="client-auth-error" role="alert">{message}</p>}
          <button className="button button-red button-wide client-auth-submit" disabled={busy}>
            {busy ? 'Aguarde…' : isConfirmation ? 'Cadastrar minha senha' : creatingAccount ? 'Enviar link por e-mail' : 'Entrar na minha conta'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>}

        {!isConfirmation && !emailSent && !accountCreated && <>
          <div className="client-auth-divider"><span>OU</span></div>
          <p className="client-auth-switch">
            {creatingAccount ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
            <button
              type="button"
              onClick={() => {
                setCreatingAccount(!creatingAccount);
                setMessage('');
              }}
            >
              {creatingAccount ? 'Entrar' : 'Criar conta'}
            </button>
          </p>
        </>}
        <p className="client-auth-footnote"><span aria-hidden="true">▣</span> Seus dados são protegidos e usados apenas para acessar sua conta.</p>
      </div>
    </section>
  </main>;
}
