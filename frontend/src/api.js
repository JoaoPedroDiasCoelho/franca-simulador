const configuredBase = import.meta.env.VITE_API_BASE_URL;
const API_ORIGIN = configuredBase?.replace(/\/$/, '') || '';
const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

export function apiAssetUrl(path) {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return API_ORIGIN ? `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}` : path;
}

function authorization(credentials) {
  const bytes = new TextEncoder().encode(`${credentials.usuario}:${credentials.senha}`);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return `Basic ${btoa(binary)}`;
}

export const currency = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(Number(value) || 0);

export const percent = (value) => `${new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(value) || 0)}%`;

async function request(path, options = {}) {
  const headers = { Accept: 'application/json', ...options.headers };
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Não foi possível conectar à API em ${API_BASE_URL}. Verifique se o back-end está em execução.`);
    }
    throw error;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message
      || data?.detail
      || data?.errosValidacao?.map((item) => `${item.campo}: ${item.mensagem}`).join(' | ')
      || 'Ocorreu um erro na requisição.';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

const withAuth = (credentials) => ({ Authorization: authorization(credentials) });

export const api = {
  getMotos: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.busca) params.set('busca', filters.busca);
    if (filters.categoria && filters.categoria !== 'todas') params.set('categoria', filters.categoria);
    if (filters.precoMax) params.set('precoMax', filters.precoMax);
    return request(`/motos${params.size ? `?${params}` : ''}`);
  },
  getMotosAdmin: (credentials) => request('/admin/motos', { headers: withAuth(credentials) }),
  excluirMoto: (id, credentials) => request(`/admin/motos/${id}`, {
    method: 'DELETE',
    headers: withAuth(credentials)
  }),
  getUsuariosAdmin: (credentials) => request('/admin/users', { headers: withAuth(credentials) }),
  excluirUsuario: (username, credentials) => request(`/admin/users/${encodeURIComponent(username)}`, {
    method: 'DELETE',
    headers: withAuth(credentials)
  }),
  validarAcessoAdmin: (credentials) => request('/motos/admin-access', { headers: withAuth(credentials) }),
  cadastrarMoto: (dados, imagem, credentials) => {
    const body = new FormData();
    body.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    if (imagem) body.append('imagem', imagem);
    return request('/motos/com-imagem', { method: 'POST', headers: withAuth(credentials), body });
  },
  atualizarMoto: (id, dados, imagem, credentials) => {
    const body = new FormData();
    body.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    if (imagem) body.append('imagem', imagem);
    return request(`/admin/motos/${id}`, {
      method: 'PUT',
      headers: withAuth(credentials),
      body
    });
  },
  cadastrarUsuario: (dados, credentials) => request('/admin/users', {
    method: 'POST',
    headers: withAuth(credentials),
    body: JSON.stringify(dados)
  }),
  cadastrarCliente: (dados) => request('/clientes', {
    method: 'POST',
    body: JSON.stringify(dados)
  }),
  getCliente: (credentials) => request('/clientes/me', { headers: withAuth(credentials) }),
  getConfiguracao: (credentials) => request('/simulacoes/configuracao', { headers: withAuth(credentials) }),
  simularFinanciamento: (payload, credentials) => request('/simulacoes/financiamento', {
    method: 'POST',
    headers: withAuth(credentials),
    body: JSON.stringify(payload)
  }),
  simularConsorcio: (payload, credentials) => request('/simulacoes/consorcio', {
    method: 'POST',
    headers: withAuth(credentials),
    body: JSON.stringify(payload)
  }),
  comparar: (payload, credentials) => request('/simulacoes/comparar', {
    method: 'POST',
    headers: withAuth(credentials),
    body: JSON.stringify(payload)
  })
};
