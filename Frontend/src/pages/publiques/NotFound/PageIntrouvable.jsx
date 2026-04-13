import { Link } from 'react-router-dom';

export default function PageIntrouvable() {
  return (
    <section className="page-404">
      <h1>404</h1>
      <h2>Page introuvable</h2>
      <p>La page demandee n'existe pas ou a ete deplacee.</p>
      <div>
        <Link to="/" className="btn btn-primaire">
          Retour a l'accueil
        </Link>
      </div>
    </section>
  );
}
