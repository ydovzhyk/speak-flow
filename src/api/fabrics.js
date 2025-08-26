import axios from 'axios';

const origin = typeof window !== 'undefined' ? window.location.origin : '';
export const axiosCreateFabric = async userData => {
  const { data } = await axios.post(
    `${origin}/api/fabrics/create-fabric`,
    userData
  );
  return data;
};

export const axiosGetFabrics = async () => {
  const { data } = await axios.get(`${origin}/api/fabrics/get-fabrics`);
  return data;
};

export const axiosGetFabric = async userData => {
  const { data } = await axios.get(`${origin}/api/fabrics/get-fabric`, {
    params: { id: userData.id },
  });
  return data;
};

export const axiosEditFabric = async userData => {
  const { data } = await axios.post(
    `${origin}/api/fabrics/edit-fabric`,
    userData
  );
  return data;
};

export const axiosDeleteFabric = async id => {
  const { data } = await axios.delete(`${origin}/api/fabrics/delete-fabric`, {
    data: { id },
  });
  return data;
};
