import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthentification = create(
  persist(
    (set) => ({
      utilisateur: null,
      jetonAcces: null,
      jetonRafraichissement: null,

      setSession: (utilisateur, jetonAcces, jetonRafraichissement) =>
        set({ utilisateur, jetonAcces, jetonRafraichissement }),

      setJetons: (jetonAcces, jetonRafraichissement) =>
        set({ jetonAcces, jetonRafraichissement }),

      mettreAJourUtilisateur: (utilisateur) => set({ utilisateur }),

      deconnexion: () =>
        set({
          utilisateur: null,
          jetonAcces: null,
          jetonRafraichissement: null,
        }),
    }),
    {
      name: 'stockage-auth-cloud-library',
    }
  )
);

export default useAuthentification;
