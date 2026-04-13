import clientHttp from '../clientHttp';

export const listerLivres = async (search = '') => {
  const suffixe = search ? `?search=${encodeURIComponent(search)}` : '';
  const reponse = await clientHttp.get(`/livres${suffixe}`);
  return reponse.data;
};

export const listerLivresPublic = async () => {
  const reponse = await clientHttp.get('/livres/public');
  return reponse.data;
};

export const recupererLivreParId = async (id) => {
  const reponse = await clientHttp.get(`/livres/${id}`);
  return reponse.data;
};

export const ajouterLivre = async (payload) => {
  const reponse = await clientHttp.post('/livres', payload);
  return reponse.data;
};

export const modifierLivre = async (id, payload) => {
  const reponse = await clientHttp.put(`/livres/${id}`, payload);
  return reponse.data;
};

export const supprimerLivre = async (id) => {
  const reponse = await clientHttp.delete(`/livres/${id}`);
  return reponse.data;
};

export const basculerStatutLivre = async (id) => {
  const reponse = await clientHttp.patch(`/livres/${id}/toggle`);
  return reponse.data;
};
