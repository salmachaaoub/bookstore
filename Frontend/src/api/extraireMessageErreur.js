export const extraireMessageErreur = (erreur, messageParDefaut) => {
  if (erreur?.response?.data?.message) {
    return erreur.response.data.message;
  }

  return messageParDefaut;
};
