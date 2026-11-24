import { useEffect, useState } from 'react';
import { api, currency } from '../api.js';
import Field from '../components/Field.jsx';
import MotoImage from '../components/MotoImage.jsx';
import PageShell from '../components/PageShell.jsx';
import { routeHref } from '../utils/routes.js';

const categories = ['todas', 'Street', 'Scooter', 'Trail', 'Custom', 'Esportiva'];
const PAGE_SIZE = 9;

export function CatalogPage({ clientName, onLogout }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('todas');
  const [maxPrice, setMaxPrice] = useState('200000');
  const [motos, setMotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    setCurrentPage(1);
    const timer = window.setTimeout(loadMotos, 250);
    return () => window.clearTimeout(timer);
  }, [search, category, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(motos.length / PAGE_SIZE));
  const visibleMotos = motos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return <PageShell page="motos" clientName={clientName} onLogout={onLogout}>
    <main className="page-main wrap">
      <div className="page-heading">
        <div><span className="eyebrow">Encontre a sua próxima</span><h1>Catálogo de <em>motos.</em></h1>
          <p>Consulte os modelos e preços. Escolha uma moto para comparar as opções de pagamento.</p></div>
        <span className="count-pill" aria-live="polite">{status === 'loading' ? 'Carregando…' : status === 'error' ? 'Indisponível' : `${motos.length} ${motos.length === 1 ? 'moto encontrada' : 'motos encontradas'}`}</span>
      </div>
      <section className="filter-panel">
        <label className="field search-field"><span>Buscar por marca ou modelo</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: Honda, CG 160, 300cc..." /></label>
        <label className="field price-field"><span>Preço máximo <strong>{currency(maxPrice)}</strong></span><input type="range" min="10000" max="200000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label>
        <div className="category-row"><span>Categoria</span>{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item === 'todas' ? 'Todas' : item}</button>)}</div>
      </section>
      {status === 'loading' && <div className="state-card" role="status"><span className="loader" />Carregando motos do catálogo…</div>}
      {status === 'error' && <div className="state-card state-error"><h2>Não foi possível carregar as motos</h2><p>{error}</p><button className="button button-dark" onClick={loadMotos}>Tentar novamente</button></div>}
      {status === 'empty' && <div className="state-card"><span className="eyebrow">Nenhum resultado</span><h2>Nenhuma moto encontrada.</h2><p>Não encontramos motocicletas que atendam aos critérios de busca ou filtros selecionados.</p></div>}
      {status === 'content' && <div className="moto-grid">{visibleMotos.map((moto) => <article className="moto-card" key={moto.id}>
        <div className="moto-visual"><MotoImage moto={moto} /><span className="moto-category">{moto.categoria}</span><span className="moto-displacement">{moto.cilindrada} cc</span></div>
        <div className="moto-card-body"><div className="moto-meta"><span>{moto.marca}</span><span>ANO {moto.anoModelo}</span></div><h2>{moto.modelo}</h2><p>{moto.descricao || 'Excelente modelo para deslocamentos diários e viagens.'}</p>
          <div className="moto-price"><span>Preço à vista</span><strong>{currency(moto.preco)}</strong></div>
          <a className="button button-dark button-wide" href={routeHref('simulador', `?motoId=${encodeURIComponent(moto.id)}`)}>Simular esta moto <span>↗</span></a>
        </div>
      </article>)}</div>}
      {status === 'content' && <nav className="catalog-pagination" aria-label="Paginação do catálogo">
        <button type="button" className="catalog-page-button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>Anterior</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button
          key={page}
          type="button"
          className={`catalog-page-button catalog-page-number ${page === currentPage ? 'active' : ''}`}
          onClick={() => setCurrentPage(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Página ${page}`}
        >{page}</button>)}
        <span className="catalog-page-status">Página {currentPage} de {totalPages}</span>
        <button type="button" className="catalog-page-button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>Próxima</button>
      </nav>}
    </main>
  </PageShell>;
}
