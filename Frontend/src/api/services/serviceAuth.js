import clientHttp from '../clientHttp';

export const inscrireUtilisateur = async (payload) => {
  const reponse = await clientHttp.post('/auth/register', payload);
  return reponse.data;
};

export const connecterUtilisateur = async (payload) => {
  const reponse = await clientHttp.post('/auth/login', payload);
  return reponse.data;
};

export const rafraichirJeton = async (refreshToken) => {
  const reponse = await clientHttp.post('/auth/refresh', { refreshToken });
  return reponse.data;
};
