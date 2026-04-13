import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import {
  modifierCategorie,
  recupererCategorieParId,
} from '../../../api/services/serviceCategories';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireObjet } from '../../../utils/formatage';

export default function ModifierCategorie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [formulaire, setFormulaire] = useState({ nom: '', description: '' });

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await recupererCategorieParId(id);
        const categorie = extraireObjet(resultat);

        setFormulaire({
          nom: categorie?.nom || '',
          description: categorie?.description || '',
        });
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger cette categorie.'));
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
      const resultat = await modifierCategorie(id, formulaire);
      setSucces(resultat?.message || 'Categorie mise a jour.');

      setTimeout(() => {
        navigate('/categories', { replace: true });
      }, 700);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de modifier cette categorie.'));
    } finally {
      setSauvegarde(false);
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement de la categorie..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Modifier categorie</h1>
          <p>Mettez a jour les informations de la categorie.</p>
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
            id="modifier-categorie-nom"
            label="Nom"
            required
            value={formulaire.nom}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, nom: event.target.value }))
            }
          />

          <ChampFormulaire
            id="modifier-categorie-description"
            label="Description"
            textarea
            value={formulaire.description}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, description: event.target.value }))
            }
          />

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
