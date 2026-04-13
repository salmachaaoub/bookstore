import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import EtatVide from '../../../composants/commun/EtatVide';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import { listerTousLesEmprunts } from '../../../api/services/serviceEmprunts';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireListe, formaterDate } from '../../../utils/formatage';

export default function ListeEmprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await listerTousLesEmprunts();
        setEmprunts(extraireListe(resultat));
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger tous les emprunts.'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  if (chargement) {
    return <IndicateurChargement label="Chargement des emprunts..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page">
        <div>
          <h1>Tous les emprunts</h1>
          <p>Vue globale des emprunts pour la gestion interne.</p>
        </div>
      </header>

      <AlerteMessage type="erreur" message={erreur} />

      {!emprunts.length ? (
        <EtatVide titre="Aucun emprunt" description="Aucun emprunt n'a ete enregistre." />
      ) : (
        <div className="tableau-wrapper">
          <table className="tableau-donnees">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Livre</th>
                <th>Date emprunt</th>
                <th>Retour prevu</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emprunts.map((emprunt) => (
                <tr key={emprunt._id}>
                  <td>{emprunt.utilisateur?.nom || '-'}</td>
                  <td>{emprunt.livre?.titre || '-'}</td>
                  <td>{formaterDate(emprunt.dateEmprunt)}</td>
                  <td>{formaterDate(emprunt.dateRetourPrevue)}</td>
                  <td>
                    <span
                      className={
                        emprunt.statut === 'RETOURNE' ? 'pastille-ok' : 'pastille-pending'
                      }
                    >
                      {emprunt.statut === 'RETOURNE' ? 'Retourne' : 'En cours'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-ligne">
                      <Link to={`/emprunts/${emprunt._id}`} className="btn btn-secondaire">
                        Detail
                      </Link>
                      {emprunt.statut !== 'RETOURNE' && (
                        <Link to={`/emprunts/${emprunt._id}/retour`} className="btn btn-primaire">
                          Retour
                        </Link>
                      )}
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
