export function getAuthDataFromStorage(store) {
  const state = store.getState();

  if (state?.auth?.accessToken) {
    const { accessToken, refreshToken, sid } = state.auth;
    return { accessToken, refreshToken, sid };
  }

  return null;
}
