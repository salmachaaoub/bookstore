import { Navigate, useLocation } from 'react-router-dom';
import useAuthentification from '../../magasin/authentification';

export default function RouteProtegee({ children, rolesAutorises = null }) {
  const { utilisateur, jetonAcces } = useAuthentification();
  const location = useLocation();

  if (!jetonAcces || !utilisateur) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (rolesAutorises && !rolesAutorises.includes(utilisateur.role)) {
    return <Navigate to="/tableau-de-bord" replace />;
  }

  return children;
}
