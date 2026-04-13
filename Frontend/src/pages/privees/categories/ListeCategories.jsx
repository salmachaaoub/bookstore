import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import EtatVide from '../../../composants/commun/EtatVide';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import {
  basculerStatutCategorie,
  listerCategories,
  supprimerCategorie,
} from '../../../api/services/serviceCategories';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireListe } from '../../../utils/formatage';
import useAuthentification from '../../../magasin/authentification';

export default function ListeCategories() {
  const { utilisateur } = useAuthentification();
  const peutGerer = ['ADMIN', 'BIBLIOTHECAIRE'].includes(utilisateur?.role);

  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  const chargerCategories = async () => {
    setErreur('');

    try {
      const resultat = await listerCategories();
      setCategories(extraireListe(resultat));
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de charger les categories.'));
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCategories();
  }, []);

  const gererBasculer = async (id) => {
    setErreur('');
    setSucces('');

    try {
      const resultat = await basculerStatutCategorie(id);
      setSucces(resultat?.message || 'Statut de categorie mis a jour.');
      await chargerCategories();
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de changer le statut.'));
    }
  };

  const gererSuppression = async (id) => {
    if (!window.confirm('Confirmer la suppression de cette categorie ?')) return;

    setErreur('');
    setSucces('');

    try {
      const resultat = await supprimerCategorie(id);
      setSucces(resultat?.message || 'Categorie supprimee.');
      await chargerCategories();
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de supprimer cette categorie.'));
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement des categories..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page">
        <div>
          <h1>Categories</h1>
          <p>Organisez le catalogue de livres par thematiques.</p>
        </div>

        {peutGerer && (
          <Link to="/categories/ajouter" className="btn btn-primaire">
            Ajouter une categorie
          </Link>
        )}
      </header>

      <AlerteMessage type="succes" message={succes} />
      <AlerteMessage type="erreur" message={erreur} />

      {!categories.length ? (
        <EtatVide
          titre="Aucune categorie"
          description="Commencez par creer votre premiere categorie."
        />
      ) : (
        <div className="tableau-wrapper">
          <table className="tableau-donnees">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Statut</th>
                {peutGerer && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.map((categorie) => (
                <tr key={categorie._id}>
                  <td>{categorie.nom}</td>
                  <td>{categorie.description || '-'}</td>
                  <td>
                    <span className={categorie.isActive ? 'pastille-ok' : 'pastille-ko'}>
                      {categorie.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {peutGerer && (
                    <td>
                      <div className="actions-ligne">
                        <Link to={`/categories/${categorie._id}/modifier`} className="btn btn-secondaire">
                          Modifier
                        </Link>
                        <BoutonAction variante="sombre" onClick={() => gererBasculer(categorie._id)}>
                          Basculer
                        </BoutonAction>
                        <BoutonAction variante="danger" onClick={() => gererSuppression(categorie._id)}>
                          Supprimer
                        </BoutonAction>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
