import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle2, CircleUserRound } from 'lucide-react';
import useAuthentification from '../../magasin/authentification';
import PastilleRole from '../commun/PastilleRole';

export default function EntetePrive() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { utilisateur, deconnexion } = useAuthentification();
  const navigate = useNavigate();

  const gererDeconnexion = () => {
    deconnexion();
    navigate('/connexion', { replace: true });
  };

  return (
    <header className="entete-prive">
      <div>
        <p className="titre-page">Espace de gestion</p>
        <small>Bienvenue {utilisateur?.nom}</small>
      </div>

      <div className="zone-profil">
        <PastilleRole role={utilisateur?.role} />

        <button
          type="button"
          className="btn-icone-profil"
          onClick={() => setMenuOuvert((v) => !v)}
          aria-label="Ouvrir le menu profil"
        >
          <CircleUserRound size={22} />
        </button>

        {menuOuvert && (
          <div className="menu-profil">
            <div className="resume-profil">
              <strong>{utilisateur?.nom}</strong>
              <small>{utilisateur?.email}</small>
            </div>

            <Link to="/profil" onClick={() => setMenuOuvert(false)}>
              <UserCircle2 size={16} />
              Mon profil
            </Link>

            <button type="button" onClick={gererDeconnexion}>
              <LogOut size={16} />
              Deconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
