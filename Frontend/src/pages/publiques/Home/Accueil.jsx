import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, BookMarked, UsersRound, Headset } from 'lucide-react';
import NavigationPublique from '../../../composants/navigation/NavigationPublique';

export default function Accueil() {
  return (
    <div className="page-publique">
      <NavigationPublique />

      <section className="conteneur hero-accueil">
        <div className="hero-texte">
          <span className="etiquette-hero">
            <Sparkles size={16} /> Gestion moderne de bibliotheque
          </span>
          <h1>Organisez, empruntez et suivez vos livres avec fluidite.</h1>
          <p>
            Cloud Library centralise les livres, categories, emprunts et comptes utilisateurs dans une
            interface claire, rapide et entierement en francais.
          </p>

          <div className="hero-actions">
            <Link to="/inscription" className="btn btn-primaire">
              Commencer maintenant <ArrowRight size={16} />
            </Link>
            <Link to="/connexion" className="btn btn-secondaire">
              J'ai deja un compte
            </Link>
          </div>
        </div>

        <article className="hero-carte-flottante">
          <h3>Ce que vous pouvez faire</h3>
          <ul>
            <li>
              <BookMarked size={16} /> Parcourir le catalogue
            </li>
            <li>
              <UsersRound size={16} /> Gérer votre profil membre
            </li>
            <li>
              <ShieldCheck size={16} /> Emprunts hautement sécurisés
            </li>
            <li>
              <Headset size={16} /> Assistance personnalisée
            </li>
          </ul>
        </article>
      </section>

      <section className="conteneur section-info">
        <div className="section-titre">
          <h2>Comment ça marche ?</h2>
          <p>Profitez d'une expérience simplifiée pour gérer vos lectures au quotidien.</p>
        </div>
        <div className="grille-fonctionnalites">
          <article className="carte-formulaire">
            <div className="bulle-etape">1</div>
            <h3>Explorez</h3>
            <p>Naviguez dans notre collection complète sans même avoir de compte.</p>
          </article>
          <article className="carte-formulaire">
            <div className="bulle-etape">2</div>
            <h3>Réservez</h3>
            <p>Connectez-vous pour choisir vos titres favoris en un clin d'œil.</p>
          </article>
          <article className="carte-formulaire">
            <div className="bulle-etape">3</div>
            <h3>Savourez</h3>
            <p>Récupérez votre livre et suivez vos dates de retour en toute simplicité.</p>
          </article>
        </div>
      </section>

      <section className="conteneur section-info" style={{ marginBottom: '6rem' }}>
        <div className="section-titre">
          <h2>Pourquoi nous choisir ?</h2>
          <p>Une solution pensée par des lecteurs, pour des lecteurs.</p>
        </div>
        <div className="section-cartes">
          <article>
            <div className="icone-fond"><ShieldCheck size={24} /></div>
            <h3>Confidentialité</h3>
            <p>Vos informations personnelles et votre historique sont protégés avec soin.</p>
          </article>
          <article>
            <div className="icone-fond"><Sparkles size={24} /></div>
            <h3>Facilité d'usage</h3>
            <p>Une interface claire et reposante pour une lecture sans distractions.</p>
          </article>
          <article>
            <div className="icone-fond"><UsersRound size={24} /></div>
            <h3>Accompagnement</h3>
            <p>Une équipe de passionnés toujours disponible pour vous guider dans vos choix.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
