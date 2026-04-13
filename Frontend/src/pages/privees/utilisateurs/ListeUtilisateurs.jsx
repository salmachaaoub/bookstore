import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import EtatVide from '../../../composants/commun/EtatVide';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import PastilleRole from '../../../composants/commun/PastilleRole';
import {
  basculerStatutUtilisateur,
  listerUtilisateurs,
  supprimerUtilisateur,
} from '../../../api/services/serviceUtilisateurs';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireListe } from '../../../utils/formatage';

export default function ListeUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  const chargerUtilisateurs = async () => {
    setErreur('');

    try {
      const resultat = await listerUtilisateurs();
      setUtilisateurs(extraireListe(resultat));
    } catch (err) {
      const message = extraireMessageErreur(err, 'Impossible de charger les utilisateurs.');

      if (err?.response?.status === 404) {
        setUtilisateurs([]);
      } else {
        setErreur(message);
      }
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const gererBasculer = async (id) => {
    setErreur('');
    setSucces('');

    try {
      const resultat = await basculerStatutUtilisateur(id);
      setSucces(resultat?.message || 'Statut mis a jour.');
      await chargerUtilisateurs();
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de changer le statut.'));
    }
  };

  const gererSuppression = async (id) => {
    if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;

    setErreur('');
    setSucces('');

    try {
      const resultat = await supprimerUtilisateur(id);
      setSucces(resultat?.message || 'Utilisateur supprime.');
      await chargerUtilisateurs();
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de supprimer l utilisateur.'));
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement des utilisateurs..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page">
        <div>
          <h1>Utilisateurs</h1>
          <p>Gestion complete des comptes et des roles.</p>
        </div>
      </header>

      <AlerteMessage type="succes" message={succes} />
      <AlerteMessage type="erreur" message={erreur} />

      {!utilisateurs.length ? (
        <EtatVide
          titre="Aucun utilisateur"
          description="Aucun compte utilisateur n'a ete trouve pour le moment."
        />
      ) : (
        <div className="tableau-wrapper">
          <table className="tableau-donnees">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Role</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((utilisateur) => (
                <tr key={utilisateur._id || utilisateur.id}>
                  <td>{utilisateur.nom}</td>
                  <td>{utilisateur.email}</td>
                  <td>
                    <PastilleRole role={utilisateur.role} />
                  </td>
                  <td>
                    <span className={utilisateur.isActive ? 'pastille-ok' : 'pastille-ko'}>
                      {utilisateur.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-ligne">
                      <Link
                        to={`/utilisateurs/${utilisateur._id || utilisateur.id}/modifier`}
                        className="btn btn-secondaire"
                      >
                        Modifier
                      </Link>
                      <BoutonAction
                        variante="sombre"
                        onClick={() => gererBasculer(utilisateur._id || utilisateur.id)}
                      >
                        Basculer
                      </BoutonAction>
                      <BoutonAction
                        variante="danger"
                        onClick={() => gererSuppression(utilisateur._id || utilisateur.id)}
                      >
                        Supprimer
                      </BoutonAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
