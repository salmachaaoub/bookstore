import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RouteProtegee from './composants/securite/RouteProtegee';
import MiseEnPagePrivee from './composants/navigation/MiseEnPagePrivee';

import Accueil from './pages/publiques/Home/Accueil';
import APropos from './pages/publiques/About/APropos';
import Support from './pages/publiques/Contact/Support';
import Connexion from './pages/publiques/Auth/Connexion';
import Inscription from './pages/publiques/Auth/Inscription';
import AffichierLivres from './pages/publiques/Livres/AffichierLivres';

import TableauDeBord from './pages/privees/TableauDeBord';
import ProfilUtilisateur from './pages/privees/profil/ProfilUtilisateur';

import ListeUtilisateurs from './pages/privees/utilisateurs/ListeUtilisateurs';
import ModifierUtilisateur from './pages/privees/utilisateurs/ModifierUtilisateur';

import ListeCategories from './pages/privees/categories/ListeCategories';
import AjouterCategorie from './pages/privees/categories/AjouterCategorie';
import ModifierCategorie from './pages/privees/categories/ModifierCategorie';

import ListeLivres from './pages/privees/livres/ListeLivres';
import AjouterLivre from './pages/privees/livres/AjouterLivre';
import ModifierLivre from './pages/privees/livres/ModifierLivre';
import EmprunterLivre from './pages/privees/livres/EmprunterLivre';

import MesEmprunts from './pages/privees/emprunts/MesEmprunts';
import ListeEmprunts from './pages/privees/emprunts/ListeEmprunts';
import DetailEmprunt from './pages/privees/emprunts/DetailEmprunt';
import RetourEmprunt from './pages/privees/emprunts/RetourEmprunt';

import PageIntrouvable from './pages/publiques/NotFound/PageIntrouvable';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/support" element={<Support />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/nos-livres" element={<AffichierLivres />} />

        <Route
          element={
            <RouteProtegee>
              <MiseEnPagePrivee />
            </RouteProtegee>
          }
        >
          <Route path="/tableau-de-bord" element={<TableauDeBord />} />
          <Route path="/profil" element={<ProfilUtilisateur />} />

          <Route path="/categories" element={<ListeCategories />} />
          <Route
            path="/categories/ajouter"
            element={
              <RouteProtegee rolesAutorises={['ADMIN', 'BIBLIOTHECAIRE']}>
                <AjouterCategorie />
              </RouteProtegee>
            }
          />
          <Route
            path="/categories/:id/modifier"
            element={
              <RouteProtegee rolesAutorises={['ADMIN', 'BIBLIOTHECAIRE']}>
                <ModifierCategorie />
              </RouteProtegee>
            }
          />

          <Route path="/livres" element={<ListeLivres />} />
          <Route
            path="/livres/ajouter"
            element={
              <RouteProtegee rolesAutorises={['ADMIN', 'BIBLIOTHECAIRE']}>
                <AjouterLivre />
              </RouteProtegee>
            }
          />
          <Route
            path="/livres/:id/modifier"
            element={
              <RouteProtegee rolesAutorises={['ADMIN', 'BIBLIOTHECAIRE']}>
                <ModifierLivre />
              </RouteProtegee>
            }
          />
          <Route path="/livres/:id/emprunter" element={<EmprunterLivre />} />

          <Route path="/emprunts/mes" element={<MesEmprunts />} />
          <Route
            path="/emprunts"
            element={
              <RouteProtegee rolesAutorises={['ADMIN', 'BIBLIOTHECAIRE']}>
                <ListeEmprunts />
              </RouteProtegee>
            }
          />
          <Route
            path="/emprunts/:id"
            element={
              <RouteProtegee rolesAutorises={['ADMIN', 'BIBLIOTHECAIRE']}>
                <DetailEmprunt />
              </RouteProtegee>
            }
          />
          <Route
            path="/emprunts/:id/retour"
            element={
              <RouteProtegee rolesAutorises={['ADMIN', 'BIBLIOTHECAIRE']}>
                <RetourEmprunt />
              </RouteProtegee>
            }
          />

          <Route
            path="/utilisateurs"
            element={
              <RouteProtegee rolesAutorises={['ADMIN']}>
                <ListeUtilisateurs />
              </RouteProtegee>
            }
          />
          <Route
            path="/utilisateurs/:id/modifier"
            element={
              <RouteProtegee rolesAutorises={['ADMIN']}>
                <ModifierUtilisateur />
              </RouteProtegee>
            }
          />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/tableau-de-bord" replace />} />
        <Route path="*" element={<PageIntrouvable />} />
      </Routes>
    </BrowserRouter>
  );
}
