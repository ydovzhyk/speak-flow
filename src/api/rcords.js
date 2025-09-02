import { instance } from './auth';

export const axiosSaveRecord = async userData => {
  const { data } = await instance.post(
    `/api/records/save-record`,
    userData
  );
  return data;
};

export const axiosGetRecords = async () => {
  const { data } = await instance.get(`/api/records/get-records`);
  return data;
};

export const axiosDeleteRecord = async id => {
  const { data } = await instance.delete(`/api/records/delete-record`, {
    data: { id },
  });
  return data;
};
