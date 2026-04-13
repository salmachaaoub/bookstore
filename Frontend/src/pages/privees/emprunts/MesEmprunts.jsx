import { useEffect, useState } from 'react';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import EtatVide from '../../../composants/commun/EtatVide';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import { listerMesEmprunts } from '../../../api/services/serviceEmprunts';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireListe, formaterDate } from '../../../utils/formatage';

export default function MesEmprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const chargerEmprunts = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await listerMesEmprunts();
        setEmprunts(extraireListe(resultat));
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger vos emprunts.'));
      } finally {
        setChargement(false);
      }
    };

    chargerEmprunts();
  }, []);

  if (chargement) {
    return <IndicateurChargement label="Chargement de vos emprunts..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page">
        <div>
          <h1>Mes emprunts</h1>
          <p>Suivez les livres que vous avez empruntes.</p>
        </div>
      </header>

      <AlerteMessage type="erreur" message={erreur} />

      {!emprunts.length ? (
        <EtatVide
          titre="Aucun emprunt"
          description="Vous n'avez pas encore emprunte de livre."
        />
      ) : (
        <div className="tableau-wrapper">
          <table className="tableau-donnees">
            <thead>
              <tr>
                <th>Livre</th>
                <th>Date emprunt</th>
                <th>Retour prevu</th>
                <th>Retour reel</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {emprunts.map((emprunt) => (
                <tr key={emprunt._id}>
                  <td>{emprunt.livre?.titre || '-'}</td>
                  <td>{formaterDate(emprunt.dateEmprunt)}</td>
                  <td>{formaterDate(emprunt.dateRetourPrevue)}</td>
                  <td>{formaterDate(emprunt.dateRetourReelle)}</td>
                  <td>
                    <span
                      className={
                        emprunt.statut === 'RETOURNE' ? 'pastille-ok' : 'pastille-pending'
                      }
                    >
                      {emprunt.statut === 'RETOURNE' ? 'Retourne' : 'En cours'}
                    </span>
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
