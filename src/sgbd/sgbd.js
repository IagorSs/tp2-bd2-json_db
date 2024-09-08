import db from './db/index.js';

export const omitInternalNodes = (data) => {
  const convertObjData = (objData) => {
    const newObj = {};
  
    Object.entries(objData).forEach(entry => {
      const [key, value] = entry;
      const typeOfValue = typeof value;
  
      newObj[key] = ['object'].includes(typeOfValue) ? 'NODE' : value;
    })
  
    return newObj;
  }

  const convertArrayData = (arrData) => {
    return arrData.map(elem => {
      const typeOfElem = typeof elem;

      if (Array.isArray(elem)) return 'NODE';
      if (typeOfElem === 'object') return convertObjData(elem);

      return elem;
    });
  }

  const typeOfData = typeof data;

  if (Array.isArray(data)) return convertArrayData(data);
  
  if (typeOfData === 'object') return convertObjData(data);
}

export const get = async (query) => {
  const retrievedData = await db.getData(query);

  return omitInternalNodes(retrievedData);
}
