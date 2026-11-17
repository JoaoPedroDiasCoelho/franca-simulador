import { currency, percent } from '../api.js';
import EmptyResult from './EmptyResult.jsx';
import ResultMetric from './ResultMetric.jsx';

export default function ComparisonResult({ result }) {
  if (!result) return <EmptyResult title="Aguardando comparação" message="Compare as duas modalidades para visualizar os custos lado a lado." />;
  const fin = result.financiamento;
  const con = result.consorcio;
  const cheapest = result.modalidadeMenorCusto === 'CONSORCIO'
    ? 'Consórcio'
    : result.modalidadeMenorCusto === 'FINANCIAMENTO'
      ? 'Financiamento'
      : 'Ambas as modalidades';
  return <div className="comparison-results">
    <div className="saving-banner"><span className="eyebrow eyebrow-green">Análise de custo total</span><h3>{result.modalidadeMenorCusto === 'CUSTOS_EQUIVALENTES' ? 'As duas modalidades têm custo total estimado equivalente.' : `${cheapest} representa a menor estimativa, com diferença de ${currency(result.economiaEstimada)}.`}</h3><p>Estimativa baseada nos parâmetros informados. Considere também prazo de contemplação e posse da moto.</p><div className="saving-details"><span>Diferença estimada entre os custos totais<strong>{currency(result.diferencaCustoTotal)}</strong></span><span>Diferença estimada entre parcelas<strong>{currency(result.diferencaParcela)}</strong></span></div></div>
    <div className="compare-grid">
      <section className="result-card"><div className="result-heading"><div><span className="eyebrow">Posse imediata</span><h3>Financiamento</h3></div></div><div className="result-hero"><span>Parcela fixa</span><strong>{currency(fin.valorParcela)}</strong><small>{fin.prazoMeses}x · {percent(fin.taxaJurosMensal)} a.m.</small></div><div className="comparison-list"><ResultMetric label="Entrada" value={currency(fin.valorEntrada)} /><ResultMetric label="Total das parcelas" value={currency(fin.totalParcelas)} /><ResultMetric label="Juros pagos" value={currency(fin.totalJurosEstimado)} /><ResultMetric label="Total desembolsado" value={currency(fin.totalPagoComEntrada)} /></div></section>
      <section className="result-card"><div className="result-heading"><div><span className="eyebrow eyebrow-green">Planejamento</span><h3>Consórcio</h3></div></div><div className="result-hero green-hero"><span>Parcela estimada</span><strong>{currency(con.valorParcelaEstimada)}</strong><small>{con.prazoMeses}x · taxa adm. {percent(con.taxaAdministrativaPercentual)}</small></div><div className="comparison-list"><ResultMetric label="Entrada obrigatória" value={currency(0)} /><ResultMetric label="Taxa administrativa" value={`${currency(con.valorTaxaAdministrativa)} (${percent(con.taxaAdministrativaPercentual)})`} /><ResultMetric label="Fundo de reserva" value={`${currency(con.valorFundoReserva)} (${percent(con.fundoReservaPercentual)})`} /><ResultMetric label="Seguro total" value={currency(con.totalSeguro)} /><ResultMetric label="Custo total do plano" value={currency(con.totalEstimadoPlano)} /></div></section>
    </div>
  </div>;
}
