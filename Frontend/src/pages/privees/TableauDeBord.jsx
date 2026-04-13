import { useEffect, useState } from 'react';
import { BookOpenCheck, FolderKanban, LibraryBig, UsersRound } from 'lucide-react';
import CarteStatistique from '../../composants/commun/CarteStatistique';
import IndicateurChargement from '../../composants/commun/IndicateurChargement';
import AlerteMessage from '../../composants/commun/AlerteMessage';
import { listerLivres } from '../../api/services/serviceLivres';
import { listerCategories } from '../../api/services/serviceCategories';
import { listerMesEmprunts, listerTousLesEmprunts } from '../../api/services/serviceEmprunts';
import { listerUtilisateurs } from '../../api/services/serviceUtilisateurs';
import { extraireMessageErreur } from '../../api/extraireMessageErreur';
import useAuthentification from '../../magasin/authentification';
import { extraireListe } from '../../utils/formatage';

export default function TableauDeBord() {
  const { utilisateur } = useAuthentification();
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [stats, setStats] = useState({
    livres: 0,
    categories: 0,
    empruntsPersonnels: 0,
    empruntsGlobaux: 0,
    utilisateurs: 0,
  });

  useEffect(() => {
    const chargerDonnees = async () => {
      setErreur('');
      setChargement(true);

      try {
        const [reponseLivres, reponseCategories, reponseMesEmprunts] = await Promise.all([
          listerLivres(),
          listerCategories(),
          listerMesEmprunts(),
        ]);

        let empruntsGlobaux = [];
        let utilisateurs = [];

        if (['ADMIN', 'BIBLIOTHECAIRE'].includes(utilisateur?.role)) {
          const reponseTousEmprunts = await listerTousLesEmprunts();
          empruntsGlobaux = extraireListe(reponseTousEmprunts);
        }

        if (utilisateur?.role === 'ADMIN') {
          const reponseUtilisateurs = await listerUtilisateurs();
          utilisateurs = extraireListe(reponseUtilisateurs);
        }

        setStats({
          livres: extraireListe(reponseLivres).length,
          categories: extraireListe(reponseCategories).length,
          empruntsPersonnels: extraireListe(reponseMesEmprunts).length,
          empruntsGlobaux: empruntsGlobaux.length,
          utilisateurs: utilisateurs.length,
        });
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger le tableau de bord.'));
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, [utilisateur?.role]);

  if (chargement) {
    return <IndicateurChargement label="Chargement du tableau de bord..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue rapide de l'activite de la bibliotheque.</p>
        </div>
      </header>

      <AlerteMessage type="erreur" message={erreur} />

      <div className="grille-stats">
        <CarteStatistique
          titre="Livres"
          valeur={stats.livres}
          icone={<BookOpenCheck size={20} />}
          tonalite="bleu"
        />
        <CarteStatistique
          titre="Categories"
          valeur={stats.categories}
          icone={<FolderKanban size={20} />}
          tonalite="vert"
        />
        <CarteStatistique
          titre="Mes emprunts"
          valeur={stats.empruntsPersonnels}
          icone={<LibraryBig size={20} />}
          tonalite="ambre"
        />
        <CarteStatistique
          titre={utilisateur?.role === 'ADMIN' ? 'Utilisateurs' : 'Emprunts globaux'}
          valeur={utilisateur?.role === 'ADMIN' ? stats.utilisateurs : stats.empruntsGlobaux}
          icone={<UsersRound size={20} />}
          tonalite="rouge"
        />
      </div>
    </section>
  );
}
