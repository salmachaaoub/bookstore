import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import { connecterUtilisateur } from '../../../api/services/serviceAuth';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import useAuthentification from '../../../magasin/authentification';

export default function Connexion() {
  const [formulaire, setFormulaire] = useState({ email: '', motDePasse: '' });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const { utilisateur, setSession } = useAuthentification();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/tableau-de-bord';

  useEffect(() => {
    if (utilisateur) {
      navigate('/tableau-de-bord', { replace: true });
    }
  }, [utilisateur, navigate]);

  const gererSoumission = async (event) => {
    event.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const resultat = await connecterUtilisateur(formulaire);
      const session = resultat?.data;

      if (!session?.accessToken || !session?.refreshToken) {
        throw new Error('Session invalide');
      }

      setSession(
        {
          id: session.id,
          nom: session.nom,
          email: session.email,
          role: session.role,
          isActive: session.isActive,
        },
        session.accessToken,
        session.refreshToken
      );

      navigate(destination, { replace: true });
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de se connecter.'));
    } finally {
      setChargement(false);
    }
  };

  return (
    <section className="ecran-auth">
      <article className="carte-auth">
        <h1>Connexion</h1>
        <p>Accedez a votre espace Cloud Library.</p>

        <AlerteMessage type="erreur" message={erreur} />

        <form onSubmit={gererSoumission}>
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
            placeholder="Votre mot de passe"
            value={formulaire.motDePasse}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, motDePasse: event.target.value }))
            }
          />

          <BoutonAction type="submit" variante="primaire" plein disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </BoutonAction>
        </form>

        <p className="texte-bas-auth">
          Pas encore inscrit? <Link to="/inscription">Creer un compte</Link>
        </p>
        <p className="texte-bas-auth">
          <Link to="/">Retour a l'accueil</Link>
        </p>
      </article>
    </section>
  );
}
