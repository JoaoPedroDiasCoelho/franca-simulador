export default function ResultMetric({ label, value, highlight = false }) {
  return <div className="result-metric"><span>{label}</span><strong className={highlight ? 'text-red' : ''}>{value}</strong></div>;
}
