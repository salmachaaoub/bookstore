export const extraireListe = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export const extraireObjet = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
};

export const formaterDate = (valeur) => {
  if (!valeur) return '-';

  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
