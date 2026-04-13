import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import { recupererEmpruntParId } from '../../../api/services/serviceEmprunts';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireObjet, formaterDate } from '../../../utils/formatage';

export default function DetailEmprunt() {
  const { id } = useParams();
  const [emprunt, setEmprunt] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await recupererEmpruntParId(id);
        setEmprunt(extraireObjet(resultat));
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger ce detail d emprunt.'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, [id]);

  if (chargement) {
    return <IndicateurChargement label="Chargement du detail emprunt..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Detail emprunt</h1>
          <p>Informations completes de l'emprunt selectionne.</p>
        </div>
        <Link to="/emprunts" className="btn btn-secondaire">
          Retour
        </Link>
      </header>

      <AlerteMessage type="erreur" message={erreur} />

      {emprunt && (
        <article className="carte-formulaire largeur-fixe">
          <div className="resume-emprunt">
            <strong>Livre: {emprunt.livre?.titre || '-'}</strong>
            <p>Auteur: {emprunt.livre?.auteur || '-'}</p>
            <p>Utilisateur: {emprunt.utilisateur?.nom || '-'}</p>
            <p>Email: {emprunt.utilisateur?.email || '-'}</p>
            <p>Date emprunt: {formaterDate(emprunt.dateEmprunt)}</p>
            <p>Date retour prevue: {formaterDate(emprunt.dateRetourPrevue)}</p>
            <p>Date retour reelle: {formaterDate(emprunt.dateRetourReelle)}</p>
            <p>Statut: {emprunt.statut === 'RETOURNE' ? 'Retourne' : 'En cours'}</p>
          </div>
        </article>
      )}
    </section>
  );
}
