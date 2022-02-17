import axiosConfig from './axios-config';
import { DEMO_FLAG_NAME } from '../demo/test-env-name';
import { testUserInfo } from '../demo/initial-user-info';

const baseMsPath = '/api/validate';
const msCompletePath = `${process.env.ms.auth.path}${baseMsPath}`;

export const getUserInfo = () => {
  if(process.env.APP_ENV === DEMO_FLAG_NAME) return Promise.resolve(testUserInfo);
  return axiosConfig.get(`${msCompletePath}`)
    .then(response => response.data)
    .catch((error) => {
      if(error.response.status === 401) return false;
    });
}
