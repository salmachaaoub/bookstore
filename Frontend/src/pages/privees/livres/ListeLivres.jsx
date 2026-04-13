import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import EtatVide from '../../../composants/commun/EtatVide';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import {
  basculerStatutLivre,
  listerLivres,
  supprimerLivre,
} from '../../../api/services/serviceLivres';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireListe } from '../../../utils/formatage';
import useAuthentification from '../../../magasin/authentification';

export default function ListeLivres() {
  const { utilisateur } = useAuthentification();
  const peutGerer = ['ADMIN', 'BIBLIOTHECAIRE'].includes(utilisateur?.role);

  const [livres, setLivres] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  const chargerLivres = async (valeurRecherche = '') => {
    setErreur('');

    try {
      const resultat = await listerLivres(valeurRecherche);
      setLivres(extraireListe(resultat));
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de charger les livres.'));
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerLivres();
  }, []);

  const gererRecherche = async (event) => {
    event.preventDefault();
    setChargement(true);
    await chargerLivres(recherche.trim());
  };

  const gererBasculer = async (id) => {
    setErreur('');
    setSucces('');

    try {
      const resultat = await basculerStatutLivre(id);
      setSucces(resultat?.message || 'Statut du livre mis a jour.');
      await chargerLivres(recherche.trim());
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de changer le statut du livre.'));
    }
  };

  const gererSuppression = async (id) => {
    if (!window.confirm('Confirmer la suppression de ce livre ?')) return;

    setErreur('');
    setSucces('');

    try {
      const resultat = await supprimerLivre(id);
      setSucces(resultat?.message || 'Livre supprime.');
      await chargerLivres(recherche.trim());
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de supprimer ce livre.'));
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement des livres..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Livres</h1>
          <p>Parcourez et gerez le catalogue de la bibliotheque.</p>
        </div>

        {peutGerer && (
          <Link to="/livres/ajouter" className="btn btn-primaire">
            Ajouter un livre
          </Link>
        )}
      </header>

      <form className="carte-formulaire" onSubmit={gererRecherche}>
        <ChampFormulaire
          id="recherche-livres"
          label="Recherche"
          placeholder="Titre ou auteur"
          value={recherche}
          onChange={(event) => setRecherche(event.target.value)}
        />

        <div className="ligne-actions-form">
          <BoutonAction type="submit" variante="secondaire">
            Rechercher
          </BoutonAction>
        </div>
      </form>

      <AlerteMessage type="succes" message={succes} />
      <AlerteMessage type="erreur" message={erreur} />

      {!livres.length ? (
        <EtatVide
          titre="Aucun livre"
          description="Aucun livre n'est disponible pour cette recherche."
        />
      ) : (
        <div className="grille-cartes-livres">
          {livres.map((livre) => (
            <article key={livre._id} className="carte-livre">
              <header>
                <h3>{livre.titre}</h3>
                <span className={livre.isActive ? 'pastille-ok' : 'pastille-ko'}>
                  {livre.isActive ? 'Actif' : 'Inactif'}
                </span>
              </header>

              <p className="auteur">{livre.auteur}</p>
              <p className="meta">ISBN: {livre.isbn}</p>
              <p className="meta">Categorie: {livre.categorie?.nom || '-'}</p>
              <p className="meta">
                Disponible: {livre.exemplairesDisponibles} / {livre.quantite}
              </p>

              <div className="actions-carte">
                <Link
                  to={`/livres/${livre._id}/emprunter`}
                  className="btn btn-secondaire"
                >
                  Emprunter
                </Link>

                {peutGerer && (
                  <>
                    <Link to={`/livres/${livre._id}/modifier`} className="btn btn-secondaire">
                      Modifier
                    </Link>
                    <BoutonAction variante="sombre" onClick={() => gererBasculer(livre._id)}>
                      Basculer
                    </BoutonAction>
                    <BoutonAction variante="danger" onClick={() => gererSuppression(livre._id)}>
                      Supprimer
                    </BoutonAction>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
