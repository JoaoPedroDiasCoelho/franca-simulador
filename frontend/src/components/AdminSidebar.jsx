import Brand from './Brand.jsx';
import { routeHref } from '../utils/routes.js';

const links = [
  { id: 'motos', icon: '▦', label: 'Catálogo de motos' },
  { id: 'usuarios', icon: '♙', label: 'Usuários' }
];

export default function AdminSidebar({ active, motoCount, onNavigate, onLogout }) {
  return <aside className="admin-sidebar">
    <div className="admin-sidebar-brand"><Brand onDark /><span className="admin-brand-caption">PAINEL ADMINISTRATIVO</span></div>
    <span className="admin-sidebar-label">MENU PRINCIPAL</span>
    <nav className="admin-sidebar-nav" aria-label="Menu administrativo">
      {links.map((link) => <button key={link.id} type="button" className={active === link.id || (link.id === 'motos' && active === 'cadastro-moto') ? 'active' : ''} aria-current={active === link.id || (link.id === 'motos' && active === 'cadastro-moto') ? 'page' : undefined} onClick={() => onNavigate(link.id)}>
        <span className="admin-sidebar-icon" aria-hidden="true">{link.icon}</span>
        <span>{link.label}</span>
        {link.id === 'motos' && <span className="admin-sidebar-count">{motoCount}</span>}
      </button>)}
    </nav>
    <div className="admin-sidebar-bottom">
      <a href={routeHref('inicio')}><span aria-hidden="true">↗</span> Voltar ao site</a>
      <button type="button" onClick={onLogout}><span aria-hidden="true">⇥</span> Sair do painel</button>
    </div>
  </aside>;
}
