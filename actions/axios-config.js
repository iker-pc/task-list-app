import axios from 'axios';

const axiosInstance = axios.create({});

export function configAxios(authToken) {
  axiosInstance.defaults.headers.common['Authorization'] = authToken;
}

export default axiosInstance;
