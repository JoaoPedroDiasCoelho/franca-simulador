export default function EmptyResult({ title, message }) {
  return <div className="empty-result"><span className="result-icon">↗</span><h3>{title}</h3><p>{message}</p></div>;
}
