import { currency, percent } from '../api.js';
import EmptyResult from './EmptyResult.jsx';
import ResultMetric from './ResultMetric.jsx';

export default function ConsortiumResult({ result }) {
  if (!result) return <EmptyResult title="Aguardando parâmetros" message="Defina o prazo e as taxas administrativas para estimar seu consórcio." />;
  return <section className="result-card"><div className="result-heading"><div><span className="eyebrow eyebrow-green">Simulação de consórcio</span><h3>Sem juros de financiamento</h3></div><span className="result-tag tag-green">Taxa adm. {percent(result.taxaAdministrativaPercentual)}</span></div>
    <div className="result-hero green-hero"><span>Parcela estimada</span><strong>{currency(result.valorParcelaEstimada)}</strong><small>em {result.prazoMeses} meses · sem entrada obrigatória</small></div>
    <div className="metrics-grid"><ResultMetric label="Carta de crédito" value={currency(result.valorCarta)} /><ResultMetric label="Taxa administrativa" value={`${currency(result.valorTaxaAdministrativa)} (${percent(result.taxaAdministrativaPercentual)})`} /><ResultMetric label="Fundo de reserva" value={`${currency(result.valorFundoReserva)} (${percent(result.fundoReservaPercentual)})`} /><ResultMetric label="Seguros totais" value={currency(result.totalSeguro)} /></div>
    <div className="total-row"><span>Custo total do plano</span><strong>{currency(result.totalEstimadoPlano)}</strong></div><p className="legal-note">{result.observacaoLegal}</p>
  </section>;
}
