import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function PageShell({ page, clientName, onLogout, children }) {
  return <><Header active={page} clientName={clientName} onLogout={onLogout} />{children}<Footer /></>;
}
