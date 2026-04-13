import { useEffect, useState } from 'react';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import {
  recupererProfil,
  mettreAJourProfil,
  changerMotDePasse,
} from '../../../api/services/serviceUtilisateurs';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import useAuthentification from '../../../magasin/authentification';

export default function ProfilUtilisateur() {
  const { utilisateur, mettreAJourUtilisateur } = useAuthentification();
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [formulaireProfil, setFormulaireProfil] = useState({ nom: '', email: '' });
  const [formulaireMdp, setFormulaireMdp] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '' });

  useEffect(() => {
    const chargerProfil = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await recupererProfil();
        const donnees = resultat?.data || utilisateur;

        setFormulaireProfil({
          nom: donnees?.nom || '',
          email: donnees?.email || '',
        });
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger le profil.'));
      } finally {
        setChargement(false);
      }
    };

    chargerProfil();
  }, [utilisateur]);

  const sauvegarderProfil = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces('');

    try {
      const resultat = await mettreAJourProfil(formulaireProfil);
      const donnees = resultat?.data;

      if (donnees) {
        mettreAJourUtilisateur({
          ...utilisateur,
          ...donnees,
        });
      }

      setSucces(resultat?.message || 'Profil mis a jour.');
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de mettre a jour le profil.'));
    }
  };

  const mettreAJourMotDePasse = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces('');

    try {
      const resultat = await changerMotDePasse(formulaireMdp);
      setSucces(resultat?.message || 'Mot de passe modifie avec succes.');
      setFormulaireMdp({ ancienMotDePasse: '', nouveauMotDePasse: '' });
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de modifier le mot de passe.'));
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement du profil..." />;
  }

  return (
    <section className="espace-page espace-double">
      <article className="carte-formulaire">
        <h1>Mon profil</h1>
        <p>Modifiez vos informations principales.</p>

        <AlerteMessage type="succes" message={succes} />
        <AlerteMessage type="erreur" message={erreur} />

        <form onSubmit={sauvegarderProfil}>
          <ChampFormulaire
            id="profil-nom"
            label="Nom"
            required
            value={formulaireProfil.nom}
            onChange={(event) =>
              setFormulaireProfil((precedent) => ({ ...precedent, nom: event.target.value }))
            }
          />

          <ChampFormulaire
            id="profil-email"
            label="Email"
            type="email"
            required
            value={formulaireProfil.email}
            onChange={(event) =>
              setFormulaireProfil((precedent) => ({ ...precedent, email: event.target.value }))
            }
          />

          <div className="ligne-actions-form">
            <BoutonAction type="submit" variante="primaire">
              Enregistrer
            </BoutonAction>
          </div>
        </form>
      </article>

      <article className="carte-formulaire">
        <h2>Securite</h2>
        <p>Changez votre mot de passe.</p>

        <form onSubmit={mettreAJourMotDePasse}>
          <ChampFormulaire
            id="ancien-mot-de-passe"
            label="Ancien mot de passe"
            type="password"
            required
            value={formulaireMdp.ancienMotDePasse}
            onChange={(event) =>
              setFormulaireMdp((precedent) => ({ ...precedent, ancienMotDePasse: event.target.value }))
            }
          />

          <ChampFormulaire
            id="nouveau-mot-de-passe"
            label="Nouveau mot de passe"
            type="password"
            required
            value={formulaireMdp.nouveauMotDePasse}
            onChange={(event) =>
              setFormulaireMdp((precedent) => ({ ...precedent, nouveauMotDePasse: event.target.value }))
            }
          />

          <div className="ligne-actions-form">
            <BoutonAction type="submit" variante="sombre">
              Mettre a jour
            </BoutonAction>
          </div>
        </form>
      </article>
    </section>
  );
}
