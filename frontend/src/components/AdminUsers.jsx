import { useState } from 'react';

export default function AdminUsers({ users, loading, error, saving, currentUsername, onRefresh, onCreate, onDelete }) {
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [deletingUsername, setDeletingUsername] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteError, setDeleteError] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setMessageError(false);
    setEmailError('');
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const created = await onCreate({
        usuario: String(data.get('usuario')).trim(),
        nome: String(data.get('nome')).trim(),
        email: String(data.get('email')).trim(),
        senha: String(data.get('senha'))
      });
      form.reset();
      setMessage(`Usuário ${created.usuario} criado com sucesso.`);
    } catch (requestError) {
      setMessageError(true);
      if (requestError.status === 409 && /e-mail|email/i.test(requestError.message)) {
        setEmailError('Este e-mail já está cadastrado. Informe outro e-mail.');
      } else {
        setMessage(requestError.message);
      }
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Deseja excluir o usuário ${user.usuario}? Esta ação não pode ser desfeita.`)) return;
    setDeletingUsername(user.usuario);
    setDeleteMessage('');
    setDeleteError(false);
    try {
      await onDelete(user.usuario);
      setDeleteMessage(`Usuário ${user.usuario} excluído com sucesso.`);
    } catch (requestError) {
      setDeleteError(true);
      setDeleteMessage(requestError.message);
    } finally {
      setDeletingUsername(null);
    }
  };

  return <section className="admin-workspace">
    <div className="admin-page-heading"><div><span className="eyebrow">ACESSOS</span><h1>Usuários</h1><p>Gerencie quem pode acessar o painel administrativo.</p></div></div>
    <div className="admin-users-layout">
      <form className="admin-user-form" onSubmit={submit}><span className="eyebrow">NOVO ACESSO</span><h2>Criar usuário</h2><p>As senhas são armazenadas com hash BCrypt.</p>
        <label className="field"><span>Usuário *</span><input name="usuario" minLength="1" maxLength="50" pattern="[A-Za-z0-9._-]+" autoComplete="off" placeholder="Ex.: joao.silva" required /></label>
        <label className="field"><span>Nome completo *</span><input name="nome" maxLength="150" autoComplete="name" placeholder="Ex.: João da Silva" required /></label>
        <label className="field"><span>E-mail *</span><input name="email" type="email" maxLength="254" autoComplete="email" placeholder="Ex.: joao@email.com" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'admin-user-email-error' : undefined} onChange={() => setEmailError('')} required />{emailError && <span id="admin-user-email-error" className="field-error" role="alert">{emailError}</span>}</label>
        <label className="field"><span>Senha (mínimo 8 caracteres) *</span><input name="senha" type="password" minLength="8" maxLength="72" autoComplete="new-password" required /></label>
        <button className="button button-red button-wide" disabled={saving}>{saving ? 'Criando…' : 'Criar usuário'} <span aria-hidden="true">↗</span></button>
        <p className={`form-message ${messageError ? 'message-error' : ''}`} role="status" aria-live="polite">{message}</p>
      </form>
      <div className="admin-list-card admin-users-list">
        <div className="admin-list-toolbar"><div><h2>Acessos ativos</h2><p>{users.length} usuários</p></div><button className="admin-refresh" type="button" onClick={onRefresh} disabled={loading} aria-label="Atualizar usuários">↻</button></div>
        <div className="admin-inventory-table"><table><thead><tr><th>USUÁRIO</th><th>PERMISSÃO</th><th aria-label="Ações" /></tr></thead><tbody>
          {error ? <tr><td colSpan="3"><div className="admin-table-state is-error">{error}</div></td></tr>
            : loading && !users.length ? <tr><td colSpan="3"><div className="admin-table-state">Carregando usuários…</div></td></tr>
              : users.length ? users.map((user) => <tr key={user.usuario}><td><div className="admin-user-cell"><span>{user.usuario.slice(0, 1).toUpperCase()}</span><strong>{user.usuario}</strong></div></td><td><span className="admin-category-pill">Administrador</span></td><td><button className="admin-delete-button" type="button" onClick={() => deleteUser(user)} disabled={user.usuario === currentUsername || deletingUsername !== null} title={user.usuario === currentUsername ? 'Não é possível excluir sua própria conta' : undefined} aria-label={`Excluir usuário ${user.usuario}`}>{deletingUsername === user.usuario ? 'Excluindo…' : 'Excluir'}</button></td></tr>)
                : <tr><td colSpan="3"><div className="admin-table-state">Nenhum usuário cadastrado.</div></td></tr>}
        </tbody></table></div>
        <p className={`form-message ${deleteError ? 'message-error' : ''}`} role="status" aria-live="polite">{deleteMessage}</p>
      </div>
    </div>
  </section>;
}
