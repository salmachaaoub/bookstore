import NavigationPublique from '../../../composants/navigation/NavigationPublique';
import { Target, History, BookOpen, Clock, Heart } from 'lucide-react';

export default function APropos() {
  return (
    <div className="page-publique">
      <NavigationPublique />

      <main className="conteneur" style={{ padding: '4rem 0' }}>
        <div className="section-titre">
          <h1>À propos de votre Bibliothèque</h1>
          <p>Un espace dédié à la découverte, au partage et à l'épanouissement intellectuel.</p>
        </div>

        <section className="bloc-contenu-public">
          <div className="hero-accueil" style={{ padding: 0 }}>
            <div>
              <div className="icone-fond"><Target size={24} /></div>
              <h2>Notre Engagement</h2>
              <p>
                Nous croyons que la lecture doit être accessible à tous. Notre système a été 
                pensé pour simplifier votre parcours de lecteur : de la recherche d'un ouvrage 
                jusqu'à son emprunt, tout est conçu pour vous faire gagner du temps.
              </p>
            </div>
            <div>
              <div className="icone-fond"><History size={24} /></div>
              <h2>Notre Histoire</h2>
              <p>
                Depuis notre création, nous n'avons cessé d'évoluer pour répondre aux besoins 
                des passionnés de lecture. Aujourd'hui, nous vous proposons une expérience 
                moderne tout en préservant l'esprit chaleureux des bibliothèques classiques.
              </p>
            </div>
          </div>
        </section>

        <section className="section-info">
          <div className="section-titre" style={{ marginTop: '2rem' }}>
            <h2>Nos Valeurs</h2>
            <p>Ce qui fait de notre établissement un lieu unique pour vous.</p>
          </div>
          <div className="grille-fonctionnalites">
            <div className="carte-livre">
              <BookOpen className="icone-secondaire" style={{ color: 'var(--primaire)' }} />
              <h4>Culture pour tous</h4>
              <p>Un catalogue varié couvrant tous les domaines, de la littérature classique aux sciences modernes.</p>
            </div>
            <div className="carte-livre">
              <Clock className="icone-secondaire" style={{ color: 'var(--primaire)' }} />
              <h4>Simplicité de prêt</h4>
              <p>Empruntez vos livres en quelques secondes et gérez vos retours depuis votre espace personnel.</p>
            </div>
            <div className="carte-livre">
              <Heart className="icone-secondaire" style={{ color: 'var(--primaire)' }} />
              <h4>Espace d'étude</h4>
              <p>Plus qu'un simple stock de livres, nous offrons un environnement calme et propice à la concentration.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
