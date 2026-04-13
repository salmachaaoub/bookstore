import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const configuration = {
  erreur: {
    classe: 'alerte alerte-erreur',
    icone: AlertCircle,
  },
  succes: {
    classe: 'alerte alerte-succes',
    icone: CheckCircle2,
  },
  info: {
    classe: 'alerte alerte-info',
    icone: Info,
  },
};

export default function AlerteMessage({ type = 'info', message }) {
  if (!message) return null;

  const item = configuration[type] || configuration.info;
  const Icone = item.icone;

  return (
    <div className={item.classe} role="alert">
      <Icone size={18} />
      <span>{message}</span>
    </div>
  );
}
