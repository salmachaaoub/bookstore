import clientHttp from '../clientHttp';

export const recupererProfil = async () => {
  const reponse = await clientHttp.get('/utilisateurs/profile');
  return reponse.data;
};

export const mettreAJourProfil = async (payload) => {
  const reponse = await clientHttp.put('/utilisateurs/profile/update', payload);
  return reponse.data;
};

export const changerMotDePasse = async (payload) => {
  const reponse = await clientHttp.put(
    '/utilisateurs/profile/change-password',
    payload
  );
  return reponse.data;
};

export const listerUtilisateurs = async () => {
  const reponse = await clientHttp.get('/utilisateurs');
  return reponse.data;
};

export const recupererUtilisateurParId = async (id) => {
  const reponse = await clientHttp.get(`/utilisateurs/${id}`);
  return reponse.data;
};

export const modifierUtilisateur = async (id, payload) => {
  const reponse = await clientHttp.put(`/utilisateurs/${id}`, payload);
  return reponse.data;
};

export const supprimerUtilisateur = async (id) => {
  const reponse = await clientHttp.delete(`/utilisateurs/${id}`);
  return reponse.data;
};

export const basculerStatutUtilisateur = async (id) => {
  const reponse = await clientHttp.patch(`/utilisateurs/${id}/toggle`);
  return reponse.data;
};
