import { Link, NavLink } from 'react-router-dom';
import { BookOpenText, HandHelping, Info } from 'lucide-react';
import logo from '../../images/logo.png';

export default function NavigationPublique() {
  return (
    <header className="navigation-publique">
      <div className="conteneur navigation-publique-contenu">
        <Link to="/" className="logo-marque">
          <img src={logo} alt="Salma Library Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Salma Library</span>
        </Link>

        <nav className="menu-public" aria-label="Navigation principale">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Accueil
          </NavLink>
          <NavLink to="/nos-livres" className={({ isActive }) => (isActive ? 'active' : '')}>
            <BookOpenText size={16} />
            Livres
          </NavLink>
          <NavLink to="/a-propos" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Info size={16} />
            A propos
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HandHelping size={16} />
            Support
          </NavLink>
        </nav>

        <div className="actions-public">
          <Link to="/connexion" className="btn btn-secondaire">
            Connexion
          </Link>
          <Link to="/inscription" className="btn btn-primaire">
            Inscription
          </Link>
        </div>
      </div>
    </header>
  );
}
