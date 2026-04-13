import NavigationPublique from '../../../composants/navigation/NavigationPublique';
import { Mail, Clock, HelpCircle, BookCheck, Users, Info } from 'lucide-react';

export default function Support() {
  return (
    <div className="page-publique">
      <NavigationPublique />

      <main className="conteneur" style={{ padding: '4rem 0' }}>
        <div className="section-titre">
          <h1>Guide et Assistance</h1>
          <p>Retrouvez ici toutes les informations pratiques pour votre bibliothèque.</p>
        </div>

        <section className="support-grid" style={{ display: 'grid', gap: '2rem', marginBottom: '4rem' }}>
          <div className="bloc-contenu-public">
            <h2>Questions fréquentes</h2>
            <div className="faq-item">
              <h4><HelpCircle size={18} inline /> Comment s'inscrire à la bibliothèque ?</h4>
              <p>Cliquez sur "Créer un compte" en haut à droite. Une fois votre compte activé, vous pourrez emprunter n'importe quel livre disponible.</p>
            </div>
            <div className="faq-item">
              <h4><BookCheck size={18} inline /> Combien de livres puis-je emprunter ?</h4>
              <p>Chaque membre peut emprunter jusqu'à 5 livres simultanément pour une durée maximale de 21 jours par ouvrage.</p>
            </div>
            <div className="faq-item">
              <h4><Users size={18} inline /> J'ai perdu mon mot de passe ?</h4>
              <p>Contactez l'accueil de la bibliothèque ou envoyez-nous un e-mail pour que nous puissions réinitialiser vos accès en toute sécurité.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem', alignContent: 'start' }}>
            <article className="carte-auth" style={{ width: '100%', padding: '2rem' }}>
              <div className="icone-fond"><Mail size={24} /></div>
              <h3>Bureau d'aide</h3>
              <p>Besoin d'une assistance directe ? Notre équipe de bibliothécaires vous répond sous 24h.</p>
              <div style={{ marginTop: '1rem', fontWeight: 'bold', color: 'var(--primaire)' }}>
                contact@bibliotheque-cloud.fr
              </div>
            </article>

            <article className="carte-auth" style={{ width: '100%', padding: '2rem' }}>
              <div className="icone-fond"><Clock size={24} /></div>
              <h3>Nous rencontrer</h3>
              <p>L'accueil physique est ouvert tout au long de la semaine pour vous accompagner.</p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                <li>Lundi - Vendredi : <strong>09:00 - 18h30</strong></li>
                <li>Samedi : <strong>10:00 - 16h00</strong></li>
              </ul>
            </article>

            <article className="carte-formulaire" style={{ borderStyle: 'solid', borderColor: 'var(--primaire)' }}>
              <div className="icone-fond">
                <Info size={24} />
              </div>
              <h3>Bon à savoir</h3>
              <p>Pensez à ramener vos ouvrages à temps pour permettre aux autres lecteurs d'en profiter ! Les prolongations sont possibles sur demande.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
