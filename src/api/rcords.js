import { instance } from './auth';

export const axiosSaveRecord = async userData => {
  const { data } = await instance.post(
    `/records/save-record`,
    userData
  );
  return data;
};

export const axiosGetRecords = async () => {
  const { data } = await instance.get(`/records/get-records`);
  return data;
};

export const axiosDeleteRecord = async id => {
  const { data } = await instance.delete(`/records/delete/${id}`);
  return data;
};
