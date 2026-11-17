import { currency, percent } from '../api.js';
import EmptyResult from './EmptyResult.jsx';
import ResultMetric from './ResultMetric.jsx';

export default function FinancingResult({ result }) {
  if (!result) return <EmptyResult title="Aguardando parâmetros" message="Defina a entrada e o prazo e calcule para ver as parcelas pela Tabela Price." />;
  return <section className="result-card"><div className="result-heading"><div><span className="eyebrow">Simulação de financiamento</span><h3>Sistema Price</h3></div><span className="result-tag">{percent(result.taxaJurosMensal)} a.m.</span></div>
    <div className="result-hero"><span>Parcela estimada</span><strong>{currency(result.valorParcela)}</strong><small>em {result.prazoMeses} parcelas mensais</small></div>
    <div className="metrics-grid"><ResultMetric label="Valor da moto" value={currency(result.valorReferencia)} /><ResultMetric label="Entrada informada" value={currency(result.valorEntrada)} /><ResultMetric label="Saldo financiado" value={currency(result.valorFinanciado)} /><ResultMetric label="Total de juros" value={currency(result.totalJurosEstimado)} highlight /></div>
    <div className="total-row"><span>Total pago estimado</span><strong>{currency(result.totalPagoComEntrada)}</strong></div><p className="legal-note">{result.observacaoLegal}</p>
  </section>;
}
