import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AlerteMessage from '../../../composants/commun/AlerteMessage';
import BoutonAction from '../../../composants/commun/BoutonAction';
import ChampFormulaire from '../../../composants/commun/ChampFormulaire';
import IndicateurChargement from '../../../composants/commun/IndicateurChargement';
import { modifierLivre, recupererLivreParId } from '../../../api/services/serviceLivres';
import { extraireMessageErreur } from '../../../api/extraireMessageErreur';
import { extraireObjet } from '../../../utils/formatage';

export default function ModifierLivre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [isbn, setIsbn] = useState('');
  const [categorie, setCategorie] = useState('');
  const [formulaire, setFormulaire] = useState({
    titre: '',
    auteur: '',
    quantite: 0,
  });

  useEffect(() => {
    const chargerLivre = async () => {
      setChargement(true);
      setErreur('');

      try {
        const resultat = await recupererLivreParId(id);
        const livre = extraireObjet(resultat);

        setFormulaire({
          titre: livre?.titre || '',
          auteur: livre?.auteur || '',
          quantite: livre?.quantite ?? 0,
        });
        setIsbn(livre?.isbn || '');
        setCategorie(livre?.categorie?.nom || '-');
      } catch (err) {
        setErreur(extraireMessageErreur(err, 'Impossible de charger ce livre.'));
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
    setSauvegarde(true);

    try {
      const resultat = await modifierLivre(id, {
        ...formulaire,
        quantite: Number(formulaire.quantite),
      });

      setSucces(resultat?.message || 'Livre mis a jour.');

      setTimeout(() => {
        navigate('/livres', { replace: true });
      }, 700);
    } catch (err) {
      setErreur(extraireMessageErreur(err, 'Impossible de modifier ce livre.'));
    } finally {
      setSauvegarde(false);
    }
  };

  if (chargement) {
    return <IndicateurChargement label="Chargement du livre..." />;
  }

  return (
    <section className="espace-page">
      <header className="entete-page entete-page-empile">
        <div>
          <h1>Modifier livre</h1>
          <p>Mettre a jour les informations principales du livre.</p>
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
            id="modifier-livre-titre"
            label="Titre"
            required
            value={formulaire.titre}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, titre: event.target.value }))
            }
          />

          <ChampFormulaire
            id="modifier-livre-auteur"
            label="Auteur"
            required
            value={formulaire.auteur}
            onChange={(event) =>
              setFormulaire((precedent) => ({ ...precedent, auteur: event.target.value }))
            }
          />

          <ChampFormulaire id="modifier-livre-isbn" label="ISBN" value={isbn} disabled />
          <ChampFormulaire id="modifier-livre-categorie" label="Categorie" value={categorie} disabled />

          <ChampFormulaire
            id="modifier-livre-quantite"
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
            <BoutonAction type="submit" variante="primaire" disabled={sauvegarde}>
              {sauvegarde ? 'Enregistrement...' : 'Enregistrer'}
            </BoutonAction>
          </div>
        </form>
      </article>
    </section>
  );
}
