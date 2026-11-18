import { useState } from 'react';
import { api } from '../api.js';
import AdminMotoForm from '../components/AdminMotoForm.jsx';
import AdminMotoList from '../components/AdminMotoList.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminUsers from '../components/AdminUsers.jsx';
import Brand from '../components/Brand.jsx';
import Field from '../components/Field.jsx';
import { routeHref } from '../utils/routes.js';

export function AdminPage() {
  const [credentials, setCredentials] = useState(null);
  const [login, setLogin] = useState({ usuario: 'admin', senha: '' });
  const [loginMessage, setLoginMessage] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [view, setView] = useState('motos');
  const [editingMoto, setEditingMoto] = useState(null);
  const [motos, setMotos] = useState([]);
  const [users, setUsers] = useState([]);
  const [motosError, setMotosError] = useState('');
  const [usersError, setUsersError] = useState('');
  const [motosLoading, setMotosLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [motoSaving, setMotoSaving] = useState(false);
  const [userSaving, setUserSaving] = useState(false);

  const loadMotos = async (auth = credentials) => {
    if (!auth) return;
    setMotosError('');
    setMotosLoading(true);
    try {
      setMotos(await api.getMotosAdmin(auth));
    } catch (error) {
      setMotosError(error.message);
    } finally {
      setMotosLoading(false);
    }
  };
  const loadUsers = async (auth = credentials) => {
    if (!auth) return;
    setUsersError('');
    setUsersLoading(true);
    try {
      setUsers(await api.getUsuariosAdmin(auth));
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };
  const signIn = async (event) => {
    event.preventDefault();
    setLoginBusy(true);
    setLoginMessage('Validando acesso…');
    try {
      await api.validarAcessoAdmin(login);
      setCredentials(login);
      setLoginMessage('');
      await Promise.all([loadMotos(login), loadUsers(login)]);
    } catch (error) {
      setLoginMessage(error.status === 401 || error.status === 403 ? 'Usuário ou senha inválidos.' : error.message);
    } finally {
      setLoginBusy(false);
    }
  };
  const saveMoto = async (data, image) => {
    setMotoSaving(true);
    try {
      if (editingMoto) await api.atualizarMoto(editingMoto.id, data, image, credentials);
      else await api.cadastrarMoto(data, image, credentials);
      await loadMotos();
      setEditingMoto(null);
      setView('motos');
    } catch (error) {
      if (error.status === 401 || error.status === 403) throw new Error('Acesso expirado. Entre novamente para salvar motos.');
      throw error;
    } finally {
      setMotoSaving(false);
    }
  };
  const createUser = async (data) => {
    setUserSaving(true);
    try {
      const created = await api.cadastrarUsuario(data, credentials);
      await loadUsers();
      return created;
    } catch (error) {
      if (error.status === 409) throw new Error('Já existe um usuário com esse nome.');
      if (error.status === 401 || error.status === 403) throw new Error('Acesso expirado. Entre novamente para cadastrar usuários.');
      throw error;
    } finally {
      setUserSaving(false);
    }
  };
  const deleteMoto = async (id) => {
    try {
      await api.excluirMoto(id, credentials);
      await loadMotos();
    } catch (error) {
      if (error.status === 401 || error.status === 403) throw new Error('Acesso expirado. Entre novamente para excluir motos.');
      throw error;
    }
  };
  const deleteUser = async (username) => {
    try {
      await api.excluirUsuario(username, credentials);
      await loadUsers();
    } catch (error) {
      if (error.status === 401 || error.status === 403) throw new Error('Acesso expirado. Entre novamente para excluir usuários.');
      throw error;
    }
  };
  const navigate = (nextView) => {
    if (nextView === 'motos') setEditingMoto(null);
    setView(nextView);
    if (nextView === 'motos') loadMotos();
    if (nextView === 'usuarios') loadUsers();
  };
  const editMoto = (moto) => {
    setEditingMoto(moto);
    setView('cadastro-moto');
  };
  const logout = () => {
    setCredentials(null);
    setMotos([]);
    setUsers([]);
    setMotosError('');
    setUsersError('');
    setEditingMoto(null);
    setView('motos');
    setLogin({ usuario: 'admin', senha: '' });
  };

  if (!credentials) return <main className="admin-login">
    <section className="admin-login-story">
      <img className="admin-login-photo" src="/assets/admin-motorcycle.webp" alt="Motocicleta esportiva em destaque" />
      <Brand onDark />
      <div className="admin-login-copy">
        <span className="eyebrow eyebrow-light">Área restrita</span>
        <h1>Mais controle.<br /><em>Novas possibilidades.</em></h1>
        <p>Gerencie o catálogo e os acessos administrativos do França Simulador.</p>
        <span className="admin-login-caption">FRANÇA SIMULADOR <i /> GESTÃO DO CATÁLOGO</span>
      </div>
      <small>© 2026 França Simulador</small>
    </section>
    <section className="admin-login-form">
      <a className="back-link" href={routeHref('motos')}><span aria-hidden="true">←</span> Voltar ao catálogo</a>
      <div className="login-card">
        <span className="eyebrow">Painel administrativo</span>
        <h2>Bem-vindo de volta.</h2>
        <p>Entre com suas credenciais para continuar.</p>
        <form onSubmit={signIn}>
          <Field label="Usuário"><input autoComplete="username" required value={login.usuario} onChange={(event) => setLogin({ ...login, usuario: event.target.value })} /></Field>
          <Field label="Senha"><input type="password" autoComplete="current-password" required value={login.senha} onChange={(event) => setLogin({ ...login, senha: event.target.value })} /></Field>
          <button className="button button-red button-wide" disabled={loginBusy}>{loginBusy ? 'Validando…' : 'Entrar'} <span>↗</span></button>
          <p className="form-message form-error" role="status" aria-live="polite">{loginMessage}</p>
        </form>
      </div>
    </section>
  </main>;

  return <main className="admin-app">
    <AdminSidebar active={view} motoCount={motos.length} onNavigate={navigate} onLogout={logout} />
    <div className="admin-app-main">
      {view === 'motos' && <AdminMotoList motos={motos} loading={motosLoading} error={motosError} onRefresh={() => loadMotos()} onCreate={() => { setEditingMoto(null); setView('cadastro-moto'); }} onEdit={editMoto} onDelete={deleteMoto} />}
      {view === 'cadastro-moto' && <AdminMotoForm key={editingMoto?.id ?? 'nova-moto'} moto={editingMoto} saving={motoSaving} onCancel={() => navigate('motos')} onSubmit={saveMoto} />}
      {view === 'usuarios' && <AdminUsers users={users} loading={usersLoading} error={usersError} saving={userSaving} currentUsername={credentials.usuario} onRefresh={() => loadUsers()} onCreate={createUser} onDelete={deleteUser} />}
    </div>
  </main>;
}
