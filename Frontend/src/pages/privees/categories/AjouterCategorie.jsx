import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import { ajouterCategorie } from '../../../api/services/serviceCategories';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';

export default function AjouterCategorie() {
  const [formulaire, setFormulaire] = useState({ nom: '', description: '' });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const navigate = useNavigate();

  const gererSoumission = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces('');
    setChargement(true);

    try {
      const resultat = await ajouterCategorie(formulaire);
      setSucces(resultat?.message || 'Categorie creee avec succes.');

      setTimeout(() => {
        navigate('/categories', { replace: true });
      }, 700);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de creer la categorie.'));
    } finally {
      setChargement(false);
    }
  };

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Ajouter une categorie</h1>
          <p>Creer une nouvelle categorie pour classer les livres.</p>
        </div>
        <Link to="/categories" className="btn btn-secondaire">
          Retour
        </Link>
      </header>

      <article className="carte-formulaire largeur-fixe">
        <AlerteMessage type="succes" message={succes} />
        <AlerteMessage type="erreur" message={erreur} />

        <form onSubmit={gererSoumission}>
          <ChampFormulaire
            id="categorie-nom"
            label="Nom"
            required
            value={formulaire.nom}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, nom: event.target.value }))
            }
          />

          <ChampFormulaire
            id="categorie-description"
            label="Description"
            textarea
            value={formulaire.description}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, description: event.target.value }))
            }
          />

          <div className="ligne-actions-form">
            <BoutonAction type="submit" variante="primaire" disabled={chargement}>
              {chargement ? 'Ajout...' : 'Ajouter'}
            </BoutonAction>
          </div>
        </form>
      </article>
    </section>
  );
}
