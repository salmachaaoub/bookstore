export default function IndicateurChargement({ label = 'Chargement en cours...' }) {
  return (
    <div className="indicateur-chargement" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
