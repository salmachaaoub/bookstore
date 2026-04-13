import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import { listerCategories } from '../../../api/services/serviceCategories';
import { ajouterLivre } from '../../../api/services/serviceLivres';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireListe } from '../../../utils/formatage';

export default function AjouterLivre() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [chargementCategories, setChargementCategories] = useState(true);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [formulaire, setFormulaire] = useState({
    titre: '',
    auteur: '',
    isbn: '',
    categorie: '',
    quantite: 1,
  });

  useEffect(() => {
    const chargerCategories = async () => {
      setChargementCategories(true);
      setErreur('');

      try {
        const resultat = await listerCategories();
        const liste = extraireListe(resultat).filter((item) => item.isActive);
        setCategories(liste);

        if (liste.length) {
          setFormulaire((precedent) => ({ ...precedent, categorie: precedent.categorie || liste[0]._id }));
        }
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger les categories.'));
      } finally {
        setChargementCategories(false);
      }
    };

    chargerCategories();
  }, []);

  const gererSoumission = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces('');
    setChargement(true);

    try {
      const resultat = await ajouterLivre({
        ...formulaire,
        quantite: Number(formulaire.quantite),
      });

      setSucces(resultat?.message || 'Livre ajoute avec succes.');

      setTimeout(() => {
        navigate('/livres', { replace: true });
      }, 700);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible d ajouter ce livre.'));
    } finally {
      setChargement(false);
    }
  };

  if (chargementCategories) {
    return <IndicateurChargement label="Chargement des categories..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Ajouter un livre</h1>
          <p>Creez une fiche livre complete dans le catalogue.</p>
        </div>
        <Link to="/livres" className="btn btn-secondaire">
          Retour
        </Link>
      </header>

      <article className="carte-formulaire largeur-fixe">
        <AlerteMessage type="succes" message={succes} />
        <AlerteMessage type="erreur" message={erreur} />

        <form onSubmit={gererSoumission}>
          <ChampFormulaire
            id="livre-titre"
            label="Titre"
            required
            value={formulaire.titre}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, titre: event.target.value }))
            }
          />

          <ChampFormulaire
            id="livre-auteur"
            label="Auteur"
            required
            value={formulaire.auteur}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, auteur: event.target.value }))
            }
          />

          <ChampFormulaire
            id="livre-isbn"
            label="ISBN"
            required
            value={formulaire.isbn}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, isbn: event.target.value }))
            }
          />

          <ChampFormulaire
            id="livre-categorie"
            label="Categorie"
            required
            value={formulaire.categorie}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, categorie: event.target.value }))
            }
            disabled={!categories.length}
          >
            {categories.map((categorie) => (
              <option key={categorie._id} value={categorie._id}>
                {categorie.nom}
              </option>
            ))}
          </ChampFormulaire>

          <ChampFormulaire
            id="livre-quantite"
            label="Quantite"
            type="number"
            min={0}
            required
            value={formulaire.quantite}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, quantite: event.target.value }))
            }
          />

          <div className="ligne-actions-form">
            <BoutonAction type="submit" variante="primaire" disabled={chargement || !categories.length}>
              {chargement ? 'Ajout...' : 'Ajouter'}
            </BoutonAction>
          </div>
        </form>
      </article>
    </section>
  );
}
