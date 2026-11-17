import Brand from './Brand.jsx';
import { routeHref } from '../utils/routes.js';

export default function Header({ active, clientName }) {
  const displayName = clientName?.trim();

  return <header className="site-header">
    <nav className="nav wrap" aria-label="Navegação principal">
      <Brand />
      <div className="nav-links">
        <a className={active === 'inicio' ? 'current' : ''} aria-current={active === 'inicio' ? 'page' : undefined} href={routeHref('inicio')}>Início</a>
        <a className={active === 'motos' ? 'current' : ''} aria-current={active === 'motos' ? 'page' : undefined} href={routeHref('motos')}>Catálogo de motos</a>
      </div>
      {displayName
        ? <div className="nav-profile" aria-label={`Usuário conectado: ${displayName}`}>
          <span className="nav-avatar" aria-hidden="true">{Array.from(displayName)[0].toLocaleUpperCase('pt-BR')}</span>
          <span className="nav-profile-name">{displayName}</span>
        </div>
        : <a
          className="button button-red nav-cta"
          aria-current={active === 'cliente' ? 'page' : undefined}
          href={routeHref('cliente')}
        >
          Entrar <span aria-hidden="true">↗</span>
        </a>}
    </nav>
  </header>;
}
