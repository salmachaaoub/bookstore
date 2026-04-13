import axios from 'axios';
import useAuthentification from '../magasin/authentification';

const clientHttp = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

clientHttp.interceptors.request.use(
  (config) => {
    const jetonAcces = useAuthentification.getState().jetonAcces;

    if (jetonAcces) {
      config.headers.Authorization = `Bearer ${jetonAcces}`;
    }

    return config;
  },
  (erreur) => Promise.reject(erreur)
);

clientHttp.interceptors.response.use(
  (reponse) => reponse,
  async (erreur) => {
    const requeteOriginale = erreur.config;

    if (erreur.response?.status !== 401 || requeteOriginale?._retry) {
      return Promise.reject(erreur);
    }

    requeteOriginale._retry = true;

    try {
      const { jetonRafraichissement, setJetons, deconnexion } =
        useAuthentification.getState();

      if (!jetonRafraichissement) {
        deconnexion();
        return Promise.reject(erreur);
      }

      const reponseRefresh = await axios.post(
        `${clientHttp.defaults.baseURL}/auth/refresh`,
        { refreshToken: jetonRafraichissement }
      );

      const nouveauJetonAcces = reponseRefresh.data.accessToken;

      setJetons(nouveauJetonAcces, jetonRafraichissement);
      requeteOriginale.headers.Authorization = `Bearer ${nouveauJetonAcces}`;

      return clientHttp(requeteOriginale);
    } catch (erreurRefresh) {
      const { deconnexion } = useAuthentification.getState();
      deconnexion();
      window.location.href = '/connexion';
      return Promise.reject(erreurRefresh);
    }
  }
);

export default clientHttp;
