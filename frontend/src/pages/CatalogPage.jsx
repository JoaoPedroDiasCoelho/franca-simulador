import { useEffect, useState } from 'react';
import { api, currency } from '../api.js';
import Field from '../components/Field.jsx';
import MotoImage from '../components/MotoImage.jsx';
import PageShell from '../components/PageShell.jsx';
import { routeHref } from '../utils/routes.js';

const categories = ['todas', 'Street', 'Scooter', 'Trail', 'Custom', 'Esportiva'];

export function CatalogPage({ clientName }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('todas');
  const [maxPrice, setMaxPrice] = useState('60000');
  const [motos, setMotos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const loadMotos = async () => {
    setStatus('loading');
    try {
      const results = await api.getMotos({ busca: search.trim(), categoria: category, precoMax: maxPrice });
      setMotos(results);
      setStatus(results.length ? 'content' : 'empty');
      setError('');
    } catch (requestError) {
      setError(requestError.message);
      setStatus('error');
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(loadMotos, 250);
    return () => window.clearTimeout(timer);
  }, [search, category, maxPrice]);

  return <PageShell page="motos" clientName={clientName}>
    <main className="page-main wrap">
      <div className="page-heading">
        <div><span className="eyebrow">Encontre a sua próxima</span><h1>Catálogo de <em>motos.</em></h1>
          <p>Consulte os modelos e preços. Escolha uma moto para comparar as opções de pagamento.</p></div>
        <span className="count-pill" aria-live="polite">{status === 'loading' ? 'Carregando…' : status === 'error' ? 'Indisponível' : `${motos.length} ${motos.length === 1 ? 'moto encontrada' : 'motos encontradas'}`}</span>
      </div>
      <section className="filter-panel">
        <label className="field search-field"><span>Buscar por marca ou modelo</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: Honda, CG 160, 300cc..." /></label>
        <label className="field price-field"><span>Preço máximo <strong>{currency(maxPrice)}</strong></span><input type="range" min="10000" max="60000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label>
        <div className="category-row"><span>Categoria</span>{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item === 'todas' ? 'Todas' : item}</button>)}</div>
      </section>
      {status === 'loading' && <div className="state-card" role="status"><span className="loader" />Carregando motos do catálogo…</div>}
      {status === 'error' && <div className="state-card state-error"><h2>Não foi possível carregar as motos</h2><p>{error}</p><button className="button button-dark" onClick={loadMotos}>Tentar novamente</button></div>}
      {status === 'empty' && <div className="state-card"><span className="eyebrow">Nenhum resultado</span><h2>Nenhuma moto encontrada.</h2><p>Não encontramos motocicletas que atendam aos critérios de busca ou filtros selecionados.</p></div>}
      {status === 'content' && <div className="moto-grid">{motos.map((moto) => <article className="moto-card" key={moto.id}>
        <div className="moto-visual"><MotoImage moto={moto} /><span className="moto-category">{moto.categoria}</span><span className="moto-displacement">{moto.cilindrada} cc</span></div>
        <div className="moto-card-body"><div className="moto-meta"><span>{moto.marca}</span><span>ANO {moto.anoModelo}</span></div><h2>{moto.modelo}</h2><p>{moto.descricao || 'Excelente modelo para deslocamentos diários e viagens.'}</p>
          <div className="moto-price"><span>Preço à vista</span><strong>{currency(moto.preco)}</strong></div>
          <a className="button button-dark button-wide" href={routeHref('simulador', `?motoId=${encodeURIComponent(moto.id)}`)}>Simular esta moto <span>↗</span></a>
        </div>
      </article>)}</div>}
    </main>
  </PageShell>;
}
