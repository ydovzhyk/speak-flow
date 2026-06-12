import { instance } from './auth';

export const axiosEnsureGuest = async () => {
  const { data } = await instance.post('/guest/ensure');
  return data;
};
