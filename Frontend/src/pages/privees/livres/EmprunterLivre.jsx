import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import { recupererLivreParId } from '../../../api/services/serviceLivres';
import { creerEmprunt } from '../../../api/services/serviceEmprunts';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireObjet } from '../../../utils/formatage';

export default function EmprunterLivre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livre, setLivre] = useState(null);
  const [dateRetourPrevue, setDateRetourPrevue] = useState('');
  const [chargement, setChargement] = useState(true);
  const [soumission, setSoumission] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  useEffect(() => {
    const chargerLivre = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await recupererLivreParId(id);
        setLivre(extraireObjet(resultat));
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger les details du livre.'));
      } finally {
        setChargement(false);
      }
    };

    chargerLivre();
  }, [id]);

  const gererSoumission = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces('');
    setSoumission(true);

    try {
      const resultat = await creerEmprunt({ livreId: id, dateRetourPrevue });
      setSucces(resultat?.message || 'Emprunt enregistre avec succes.');

      setTimeout(() => {
        navigate('/emprunts/mes', { replace: true });
      }, 700);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de creer cet emprunt.'));
    } finally {
      setSoumission(false);
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement du livre..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Emprunter un livre</h1>
          <p>Choisissez une date de retour prevue.</p>
        </div>
        <Link to="/livres" className="btn btn-secondaire">
          Retour
        </Link>
      </header>

      <article className="carte-formulaire largeur-fixe">
        <div className="resume-emprunt">
          <strong>{livre?.titre}</strong>
          <p>Auteur: {livre?.auteur}</p>
          <p>Disponibles: {livre?.exemplairesDisponibles}</p>
          <p>Statut: {livre?.isActive ? 'Actif' : 'Inactif'}</p>
        </div>

        <AlerteMessage type="succes" message={succes} />
        <AlerteMessage type="erreur" message={erreur} />

        <form onSubmit={gererSoumission}>
          <ChampFormulaire
            id="date-retour-prevue"
            label="Date de retour prevue"
            type="date"
            required
            value={dateRetourPrevue}
            onChange={(event) => setDateRetourPrevue(event.target.value)}
          />

          <div className="ligne-actions-form">
            <BoutonAction
              type="submit"
              variante="primaire"
              disabled={soumission || !livre?.isActive || livre?.exemplairesDisponibles <= 0}
            >
              {soumission ? 'Validation...' : 'Valider l emprunt'}
            </BoutonAction>
          </div>
        </form>
      </article>
    </section>
  );
}
