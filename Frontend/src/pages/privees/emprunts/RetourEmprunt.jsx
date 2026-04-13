import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import { recupererEmpruntParId, retournerLivre } from '../../../api/services/serviceEmprunts';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireObjet, formaterDate } from '../../../utils/formatage';

export default function RetourEmprunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emprunt, setEmprunt] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [soumission, setSoumission] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await recupererEmpruntParId(id);
        setEmprunt(extraireObjet(resultat));
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger cet emprunt.'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, [id]);

  const confirmerRetour = async () => {
    setErreur('');
    setSucces('');
    setSoumission(true);

    try {
      const resultat = await retournerLivre(id);
      setSucces(resultat?.message || 'Retour confirme avec succes.');

      setTimeout(() => {
        navigate('/emprunts', { replace: true });
      }, 700);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de retourner ce livre.'));
    } finally {
      setSoumission(false);
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement de l emprunt..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Retour d'emprunt</h1>
          <p>Confirmez le retour du livre pour mettre a jour le stock.</p>
        </div>
        <Link to="/emprunts" className="btn btn-secondaire">
          Retour
        </Link>
      </header>

      <article className="carte-formulaire largeur-fixe">
        <AlerteMessage type="succes" message={succes} />
        <AlerteMessage type="erreur" message={erreur} />

        <div className="resume-emprunt">
          <strong>{emprunt?.livre?.titre || '-'}</strong>
          <p>Utilisateur: {emprunt?.utilisateur?.nom || '-'}</p>
          <p>Date emprunt: {formaterDate(emprunt?.dateEmprunt)}</p>
          <p>Date retour prevue: {formaterDate(emprunt?.dateRetourPrevue)}</p>
          <p>Statut actuel: {emprunt?.statut === 'RETOURNE' ? 'Retourne' : 'En cours'}</p>
        </div>

        <div className="ligne-actions-form">
          <BoutonAction
            variante="primaire"
            onClick={confirmerRetour}
            disabled={soumission || emprunt?.statut === 'RETOURNE'}
          >
            {soumission ? 'Validation...' : 'Confirmer le retour'}
          </BoutonAction>
        </div>
      </article>
    </section>
  );
}
