import PageShell from '../components/PageShell.jsx';
import ComparisonResult from '../components/ComparisonResult.jsx';
import ConsortiumResult from '../components/ConsortiumResult.jsx';
import FinancingResult from '../components/FinancingResult.jsx';
import { currency } from '../api.js';

const resultTitles = {
  financiamento: 'Financiamento',
  consorcio: 'Consórcio',
  comparativo: 'Comparativo de opções',
};

export default function SharedSummaryPage({ summary }) {
  if (!summary || !resultTitles[summary.type] || !summary.result) {
    return <PageShell><main className="page-main wrap"><div className="state-card"><h2>Resumo indisponível</h2><p>Este link não contém uma simulação válida.</p></div></main></PageShell>;
  }

  return (
    <PageShell page="simulador">
      <main className="page-main wrap shared-summary">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Resumo compartilhado</span>
            <h1>Simulação de <em>{resultTitles[summary.type].toLowerCase()}.</em></h1>
            {summary.moto && <p>{summary.moto.marca} {summary.moto.modelo} · {currency(summary.moto.preco)}</p>}
          </div>
          <div className="summary-actions no-print">
            <button className="button button-outline-dark" type="button" onClick={() => window.print()}>Salvar PDF <span>↓</span></button>
            <a className="button button-red" href="/#/simulador">Fazer minha simulação <span>↗</span></a>
          </div>
        </div>
        {summary.type === 'financiamento' && <FinancingResult result={summary.result} />}
        {summary.type === 'consorcio' && <ConsortiumResult result={summary.result} />}
        {summary.type === 'comparativo' && <ComparisonResult result={summary.result} />}
        <p className="shared-summary-footnote">Valores estimados para referência. As condições finais dependem da análise e proposta da instituição responsável.</p>
      </main>
    </PageShell>
  );
}
