import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function PageShell({ page, clientName, children }) {
  return <><Header active={page} clientName={clientName} />{children}<Footer /></>;
}
