export default function CarteStatistique({ titre, valeur, icone, tonalite = 'bleu' }) {
  return (
    <article className={`carte-stat carte-stat-${tonalite}`}>
      <div className="icone">{icone}</div>
      <div>
        <p>{titre}</p>
        <strong>{valeur}</strong>
      </div>
    </article>
  );
}
