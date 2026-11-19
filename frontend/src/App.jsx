import { useEffect, useState } from 'react';
import { AdminPage } from './pages/AdminPage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import ClientAccessPage from './pages/ClientAccessPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { SimulatorPage } from './pages/SimulatorPage.jsx';
import SharedSummaryPage from './pages/SharedSummaryPage.jsx';
import { decodeSummary } from './utils/sharedSummary.js';

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
  const requestedMotoId = params.get('motoId') || '';
  useEffect(() => {
    if (page === 'simulador' && !requestedMotoId) window.location.hash = '#/motos';
  }, [page, requestedMotoId]);

  const finishClientLogin = (credentials) => {
    setClientCredentials(credentials);
    window.location.hash = '#/motos';
  };

  if (page === 'motos') return <CatalogPage clientName={clientCredentials?.nome} onLogout={() => setClientCredentials(null)} />;
  if (page === 'resumo') {
    try {
      return <SharedSummaryPage summary={decodeSummary(params.get('dados') || '')} />;
    } catch {
      return <SharedSummaryPage summary={null} />;
    }
  }
  if (page === 'simulador') {
    if (!requestedMotoId) return <CatalogPage clientName={clientCredentials?.nome} onLogout={() => setClientCredentials(null)} />;
    if (!clientCredentials) return <ClientAccessPage onSuccess={finishClientLogin} />;
    return <SimulatorPage
      motoId={requestedMotoId}
      clientCredentials={clientCredentials}
      onLogout={() => setClientCredentials(null)}
    />;
  }
  if (page === 'cliente') {
    return <ClientAccessPage onSuccess={finishClientLogin} />;
  }
  if (page === 'admin') return <AdminPage />;
  return <HomePage clientName={clientCredentials?.nome} onLogout={() => setClientCredentials(null)} />;
}
