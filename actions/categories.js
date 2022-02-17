import axiosConfig from './axios-config';
import { DEMO_FLAG_NAME } from '../demo/test-env-name';
import { categoriesInfo } from '../demo/initial-categories-info';

const baseMsPath = '/categories/';
const msCompletePath = `${process.env.ms.tasks.path}${baseMsPath}`;


export const getCategoriesList = () => {
  if(process.env.APP_ENV === DEMO_FLAG_NAME) return Promise.resolve(categoriesInfo);
  return axiosConfig.get(msCompletePath).then(response => response.data);
}

export const updateCategoriesList = (updatedCategoriesListData) => {
  if(process.env.APP_ENV === DEMO_FLAG_NAME) {
    categoriesInfo.categories = [...updatedCategoriesListData.categories]
    return Promise.resolve();
  }
  return axiosConfig.put(msCompletePath, updatedCategoriesListData);
}
