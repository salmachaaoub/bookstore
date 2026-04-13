import clientHttp from '../clientHttp';

export const listerCategories = async () => {
  const reponse = await clientHttp.get('/categories');
  return reponse.data;
};

export const recupererCategorieParId = async (id) => {
  const reponse = await clientHttp.get(`/categories/${id}`);
  return reponse.data;
};

export const ajouterCategorie = async (payload) => {
  const reponse = await clientHttp.post('/categories', payload);
  return reponse.data;
};

export const modifierCategorie = async (id, payload) => {
  const reponse = await clientHttp.put(`/categories/${id}`, payload);
  return reponse.data;
};

export const supprimerCategorie = async (id) => {
  const reponse = await clientHttp.delete(`/categories/${id}`);
  return reponse.data;
};

export const basculerStatutCategorie = async (id) => {
  const reponse = await clientHttp.patch(`/categories/${id}/toggle`);
  return reponse.data;
};
