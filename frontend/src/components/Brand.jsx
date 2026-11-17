import { routeHref } from '../utils/routes.js';

export default function Brand({ onDark = false }) {
  return <a className={`brand${onDark ? ' brand-light' : ''}`} href={routeHref('inicio')} aria-label="França Simulador, início">
    <span className="brand-mark" aria-hidden="true"><span className="flag-stripe flag-blue" /><span className="flag-stripe flag-white" /><span className="flag-stripe flag-red" /></span>
    <span>França <strong>Simulador</strong></span>
  </a>;
}
