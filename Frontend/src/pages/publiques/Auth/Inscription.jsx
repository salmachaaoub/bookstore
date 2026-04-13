import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import { inscrireUtilisateur } from '../../../api/services/serviceAuth';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import useAuthentification from '../../../magasin/authentification';

export default function Inscription() {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    email: '',
    motDePasse: '',
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const navigate = useNavigate();
  const { utilisateur } = useAuthentification();

  useEffect(() => {
    if (utilisateur) {
      navigate('/tableau-de-bord', { replace: true });
    }
  }, [utilisateur, navigate]);

  const gererSoumission = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces('');
    setChargement(true);

    try {
      const resultat = await inscrireUtilisateur(formulaire);
      setSucces(resultat?.message || 'Compte cree avec succes.');

      // Petite pause pour laisser le message visible.
      setTimeout(() => {
        navigate('/connexion', { replace: true });
      }, 900);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de creer le compte.'));
    } finally {
      setChargement(false);
    }
  };

  return (
    <section className="ecran-auth">
      <article className="carte-auth">
        <h1>Inscription</h1>
        <p>Creer votre compte pour acceder a la plateforme.</p>

        <AlerteMessage type="succes" message={succes} />
        <AlerteMessage type="erreur" message={erreur} />

        <form onSubmit={gererSoumission}>
          <ChampFormulaire
            id="nom"
            label="Nom complet"
            required
            placeholder="Votre nom"
            value={formulaire.nom}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, nom: event.target.value }))
            }
          />

          <ChampFormulaire
            id="email"
            label="Email"
            type="email"
            required
            placeholder="exemple@email.com"
            value={formulaire.email}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, email: event.target.value }))
            }
          />

          <ChampFormulaire
            id="motDePasse"
            label="Mot de passe"
            type="password"
            required
            placeholder="Minimum 6 caracteres"
            value={formulaire.motDePasse}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, motDePasse: event.target.value }))
            }
          />

          <BoutonAction type="submit" variante="primaire" plein disabled={chargement}>
            {chargement ? 'Creation...' : 'Creer mon compte'}
          </BoutonAction>
        </form>

        <p className="texte-bas-auth">
          Deja un compte? <Link to="/connexion">Se connecter</Link>
        </p>
      </article>
    </section>
  );
}
