import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LibraryBig,
  FolderKanban,
  BadgeHelp,
} from 'lucide-react';
import useAuthentification from '../../magasin/authentification';

const liens = [
  { to: '/tableau-de-bord', label: 'Tableau de bord', icone: LayoutDashboard, roles: ['ADMIN', 'BIBLIOTHECAIRE', 'MEMBRE'] },
  { to: '/livres', label: 'Livres', icone: BookOpen, roles: ['ADMIN', 'BIBLIOTHECAIRE', 'MEMBRE'] },
  { to: '/categories', label: 'Categories', icone: FolderKanban, roles: ['ADMIN', 'BIBLIOTHECAIRE', 'MEMBRE'] },
  { to: '/emprunts/mes', label: 'Mes emprunts', icone: LibraryBig, roles: ['ADMIN', 'BIBLIOTHECAIRE', 'MEMBRE'] },
  { to: '/emprunts', label: 'Tous les emprunts', icone: BadgeHelp, roles: ['ADMIN', 'BIBLIOTHECAIRE'] },
  { to: '/utilisateurs', label: 'Utilisateurs', icone: Users, roles: ['ADMIN'] },
];

export default function BarreLaterale() {
  const { utilisateur } = useAuthentification();

  return (
    <aside className="barre-laterale">
      <div className="titre-laterale">Salma Library</div>
      <nav className="menu-lateral" aria-label="Navigation espace prive">
        {liens
          .filter((lien) => lien.roles.includes(utilisateur?.role))
          .map((lien) => {
            const Icone = lien.icone;
            return (
              <NavLink
                key={lien.to}
                to={lien.to}
                className={({ isActive }) => `lien-lateral${isActive ? ' active' : ''}`}
              >
                <Icone size={18} />
                <span>{lien.label}</span>
              </NavLink>
            );
          })}
      </nav>
    </aside>
  );
}
