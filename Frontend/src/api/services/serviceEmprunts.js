import clientHttp from '../clientHttp';

export const creerEmprunt = async (payload) => {
  const reponse = await clientHttp.post('/emprunts', payload);
  return reponse.data;
};

export const listerMesEmprunts = async () => {
  const reponse = await clientHttp.get('/emprunts/me');
  return reponse.data;
};

export const listerTousLesEmprunts = async () => {
  const reponse = await clientHttp.get('/emprunts');
  return reponse.data;
};

export const recupererEmpruntParId = async (id) => {
  const reponse = await clientHttp.get(`/emprunts/${id}`);
  return reponse.data;
};

export const retournerLivre = async (id) => {
  const reponse = await clientHttp.patch(`/emprunts/${id}/retour`);
  return reponse.data;
};
