import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import {
  modifierUtilisateur,
  recupererUtilisateurParId,
} from '../../../api/services/serviceUtilisateurs';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireObjet } from '../../../utils/formatage';

export default function ModifierUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [formulaire, setFormulaire] = useState({
    nom: '',
    email: '',
    role: 'MEMBRE',
  });

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await recupererUtilisateurParId(id);
        const utilisateur = extraireObjet(resultat);

        setFormulaire({
          nom: utilisateur?.nom || '',
          email: utilisateur?.email || '',
          role: utilisateur?.role || 'MEMBRE',
        });
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger cet utilisateur.'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, [id]);

  const gererSoumission = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces('');
    setSauvegarde(true);

    try {
      const resultat = await modifierUtilisateur(id, formulaire);
      setSucces(resultat?.message || 'Utilisateur mis a jour.');

      setTimeout(() => {
        navigate('/utilisateurs', { replace: true });
      }, 700);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de modifier cet utilisateur.'));
    } finally {
      setSauvegarde(false);
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement de la fiche utilisateur..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Modifier utilisateur</h1>
          <p>Mettre a jour les informations du compte.</p>
        </div>
        <Link to="/utilisateurs" className="btn btn-secondaire">
          Retour
        </Link>
      </header>

      <article className="carte-formulaire largeur-fixe">
        <AlerteMessage type="succes" message={succes} />
        <AlerteMessage type="erreur" message={erreur} />

        <form onSubmit={gererSoumission}>
          <ChampFormulaire
            id="utilisateur-nom"
            label="Nom"
            required
            value={formulaire.nom}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, nom: event.target.value }))
            }
          />

          <ChampFormulaire
            id="utilisateur-email"
            label="Email"
            type="email"
            required
            value={formulaire.email}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, email: event.target.value }))
            }
          />

          <ChampFormulaire
            id="utilisateur-role"
            label="Role"
            value={formulaire.role}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, role: event.target.value }))
            }
          >
            <option value="ADMIN">ADMIN</option>
            <option value="BIBLIOTHECAIRE">BIBLIOTHECAIRE</option>
            <option value="MEMBRE">MEMBRE</option>
          </ChampFormulaire>

          <div className="ligne-actions-form">
            <BoutonAction type="submit" variante="primaire" disabled={sauvegarde}>
              {sauvegarde ? 'Enregistrement...' : 'Enregistrer'}
            </BoutonAction>
          </div>
        </form>
      </article>
    </section>
  );
}
