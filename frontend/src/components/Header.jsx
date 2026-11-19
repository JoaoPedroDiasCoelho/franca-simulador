import Brand from './Brand.jsx';
import { routeHref } from '../utils/routes.js';

export default function Header({ active, clientName, onLogout }) {
  const displayName = clientName?.trim();

  return <header className="site-header">
    <nav className="nav wrap" aria-label="Navegação principal">
      <Brand />
      <div className="nav-links">
        <a className={active === 'inicio' ? 'current' : ''} aria-current={active === 'inicio' ? 'page' : undefined} href={routeHref('inicio')}>Início</a>
        <a className={active === 'motos' ? 'current' : ''} aria-current={active === 'motos' ? 'page' : undefined} href={routeHref('motos')}>Catálogo de motos</a>
      </div>
      {displayName
        ? <details className="nav-account">
          <summary className="nav-profile" aria-label={`Conta de ${displayName}`}>
            <span className="nav-avatar" aria-hidden="true">{Array.from(displayName)[0].toLocaleUpperCase('pt-BR')}</span>
            <span className="nav-profile-name">{displayName}</span>
            <span className="nav-account-chevron" aria-hidden="true">⌄</span>
          </summary>
          <div className="nav-account-menu">
            <span className="nav-account-label">Conectado como</span>
            <strong>{displayName}</strong>
            <button type="button" onClick={onLogout}>Sair da conta</button>
          </div>
        </details>
        : <a className="button button-red nav-cta" aria-current={active === 'cliente' ? 'page' : undefined} href={routeHref('cliente')}>
          Entrar <span aria-hidden="true">↗</span>
        </a>}
    </nav>
  </header>;
}
