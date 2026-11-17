import { useEffect, useState } from 'react';
import { AdminPage } from './pages/AdminPage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import ClientAccessPage from './pages/ClientAccessPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { SimulatorPage } from './pages/SimulatorPage.jsx';

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash || '#/inicio');
  useEffect(() => {
    const update = () => setRoute(window.location.hash || '#/inicio');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const [path, query = ''] = route.slice(1).split('?');
  return { page: path.replace(/^\//, '') || 'inicio', params: new URLSearchParams(query) };
}

export default function App() {
  const { page, params } = useRoute();
  const [clientCredentials, setClientCredentials] = useState(null);
  if (page === 'motos') return <CatalogPage clientName={clientCredentials?.nome} />;
  if (page === 'simulador') {
    if (!clientCredentials) return <ClientAccessPage onSuccess={setClientCredentials} />;
    return <SimulatorPage
      motoId={params.get('motoId') || ''}
      clientCredentials={clientCredentials}
      onLogout={() => setClientCredentials(null)}
    />;
  }
  if (page === 'cliente/confirmacao') {
    return <ClientAccessPage confirmationPage confirmationToken={params.get('token') || ''} />;
  }
  if (page === 'cliente') {
    return <ClientAccessPage onSuccess={(credentials) => {
      setClientCredentials(credentials);
      window.location.hash = '#/simulador';
    }} />;
  }
  if (page === 'admin') return <AdminPage />;
  return <HomePage clientName={clientCredentials?.nome} />;
}
