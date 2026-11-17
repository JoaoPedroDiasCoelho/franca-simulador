import { useMemo, useState } from 'react';
import { currency } from '../api.js';
import MotoImage from './MotoImage.jsx';

export default function AdminMotoList({ motos, loading, error, onRefresh, onCreate, onEdit }) {
  const [search, setSearch] = useState('');
  const filteredMotos = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    if (!term) return motos;
    return motos.filter((moto) => `${moto.marca} ${moto.modelo} ${moto.categoria}`.toLocaleLowerCase('pt-BR').includes(term));
  }, [motos, search]);

  return <section className="admin-workspace">
    <div className="admin-page-heading">
      <div><span className="eyebrow">CATÁLOGO</span><h1>Suas motos</h1><p>Acompanhe e mantenha os modelos do catálogo atualizados.</p></div>
      <button className="button button-red" type="button" onClick={onCreate}><span aria-hidden="true">＋</span> Cadastrar moto</button>
    </div>
    <div className="admin-summary-row">
      <div className="admin-summary-card"><span className="admin-summary-icon">▦</span><div><strong>{motos.length}</strong><span>motos cadastradas</span></div></div>
      <div className="admin-summary-card"><span className="admin-summary-icon admin-summary-icon-green">↗</span><div><strong>{new Set(motos.map((moto) => moto.marca)).size}</strong><span>marcas no catálogo</span></div></div>
    </div>
    <div className="admin-list-card">
      <div className="admin-list-toolbar">
        <div><h2>Inventário</h2><p>{filteredMotos.length} {filteredMotos.length === 1 ? 'modelo' : 'modelos'}</p></div>
        <div className="admin-list-actions">
          <label className="admin-search"><span aria-hidden="true">⌕</span><input aria-label="Buscar moto" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar marca ou modelo" /></label>
          <button className="admin-refresh" type="button" onClick={onRefresh} disabled={loading} aria-label="Atualizar catálogo">↻</button>
        </div>
      </div>
      <div className="admin-inventory-table">
        <table><thead><tr><th>MODELO</th><th>CATEGORIA</th><th>ANO / CILINDRADA</th><th>PREÇO</th><th aria-label="Ações" /></tr></thead>
          <tbody>
            {error ? <tr><td colSpan="5"><div className="admin-table-state is-error"><p>{error}</p><button type="button" className="button button-outline-dark" onClick={onRefresh}>Tentar novamente</button></div></td></tr>
              : loading && !motos.length ? <tr><td colSpan="5"><div className="admin-table-state">Carregando catálogo…</div></td></tr>
                : filteredMotos.length ? filteredMotos.map((moto) => <tr key={moto.id}>
                  <td><div className="admin-list-moto"><MotoImage moto={moto} /><span><strong>{moto.marca} {moto.modelo}</strong><small>Ref. #{moto.id}</small></span></div></td>
                  <td><span className="admin-category-pill">{moto.categoria}</span></td>
                  <td>{moto.anoModelo} <span className="admin-muted">·</span> {moto.cilindrada} cc</td>
                  <td className="admin-price-cell">{currency(moto.preco)}</td>
                  <td><button className="admin-edit-button" type="button" onClick={() => onEdit(moto)} aria-label={`Editar ${moto.marca} ${moto.modelo}`}>Editar <span aria-hidden="true">↗</span></button></td>
                </tr>)
                  : <tr><td colSpan="5"><div className="admin-table-state">{search ? 'Nenhuma moto corresponde à busca.' : 'Seu catálogo ainda está vazio.'}</div></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </section>;
}
