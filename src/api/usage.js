import { instance } from './auth';

export const axiosGetUsageCurrent = async () => {
  const { data } = await instance.get('/usage/current');
  return data;
};
