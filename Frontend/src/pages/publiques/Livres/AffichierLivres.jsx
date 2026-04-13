import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, User, Info, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import useAuthentification from '../../../magasin/authentification';
import NavigationPublique from '../../../composants/navigation/NavigationPublique';
import { listerLivresPublic } from '../../../api/services/serviceLivres';

export default function AffichierLivres() {
  const [livres, setLivres] = useState([]);
  const [etat, setEtat] = useState('chargement'); // chargement | succes | erreur
  const navigate = useNavigate();
  const { utilisateur } = useAuthentification();

  useEffect(() => {
    let actif = true;

    const chargerLivres = async () => {
      try {
        const donnees = await listerLivresPublic();
        if (!actif) return;
        setLivres(donnees.data);
        setEtat('succes');
      } catch (erreur) {
        console.error('Erreur lors du chargement des livres:', erreur);
        if (!actif) return;
        setEtat('erreur');
      }
    };

    chargerLivres();

    return () => {
      actif = false;
    };
  }, []);

  const handleEmprunter = (idLivre) => {
    if (!utilisateur) {
      // Redirection vers connexion si non connecté
      navigate('/connexion', {
        state: { from: { pathname: `/livres/${idLivre}/emprunter` } },
      });
    } else {
      // Redirection vers la page d'emprunt
      navigate(`/livres/${idLivre}/emprunter`);
    }
  };

  return (
    <div className="page-publique">
      <NavigationPublique />

      <main className="conteneur">
        <header className="hero-accueil" style={{ padding: '4rem 0 2rem' }}>
          <div className="hero-texte">
            <span className="etiquette-hero">
              <ShoppingBag size={16} /> Notre Collection
            </span>
            <h1>Découvrez nos ouvrages disponibles</h1>
            <p>
              Explorez notre vaste sélection de livres. Que vous soyez passionné d'informatique, 
              de littérature ou de sciences, vous trouverez votre bonheur ici.
            </p>
          </div>
        </header>

        {etat === 'chargement' && (
          <div className="indicateur-chargement" style={{ margin: '4rem auto', width: 'fit-content' }}>
            <Loader2 className="spinner" />
            <span>Chargement des trésors de la bibliothèque...</span>
          </div>
        )}

        {etat === 'erreur' && (
          <div className="alerte alerte-erreur" style={{ margin: '2rem 0' }}>
            <AlertCircle />
            <span>Impossible de charger les livres. Veuillez réessayer plus tard.</span>
          </div>
        )}

        {etat === 'succes' && livres.length === 0 && (
          <div className="etat-vide" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Book size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3>Aucun livre trouvé</h3>
            <p>Notre bibliothèque s'agrandit, revenez bientôt !</p>
          </div>
        )}

        {etat === 'succes' && livres.length > 0 && (
          <div className="grille-cartes-livres" style={{ marginBottom: '4rem' }}>
            {livres.map((livre) => (
              <article key={livre._id} className="carte-livre">
                <header>
                  <div style={{ display: 'grid', gap: '0.25rem' }}>
                    <span className="pastille-ok" style={{ width: 'fit-content' }}>
                      {livre.categorie?.nom || 'Général'}
                    </span>
                    <h3>{livre.titre}</h3>
                  </div>
                  <Book className="icone-secondaire" style={{ color: 'var(--primaire)', opacity: 0.5 }} />
                </header>

                <div className="auteur">
                  <User size={14} inline /> {livre.auteur}
                </div>

                <div className="meta">
                  <Info size={14} /> ISBN: {livre.isbn}
                </div>

                <div className="meta" style={{ marginTop: '0.5rem' }}>
                  <strong>{livre.exemplairesDisponibles}</strong> exemplaires disponibles sur {livre.quantite}
                </div>

                <div className="actions-carte">
                  <button 
                    className="btn btn-primaire btn-plein"
                    onClick={() => handleEmprunter(livre._id)}
                    disabled={livre.exemplairesDisponibles === 0}
                  >
                    {livre.exemplairesDisponibles > 0 ? 'Emprunter ce livre' : 'Non disponible'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
