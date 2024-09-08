import { get } from './sgbd/index.js';

const getAllEquipIds = async () => {
  const dbRes = await get("/");

  return Object.keys(dbRes);
}

const getInfoAboutRadar = async (radarId) => {
  return get(`/${radarId}`);
}

const getLeiturasOfRadar = async (radarId) => {
  return get(`/${radarId}/leituras`);
}
