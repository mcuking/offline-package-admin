import axios, { AxiosRequestConfig } from 'axios';
import LocalConfig from '@/config.json';

interface ResponseData<T> {
  data: T;
  message: string;
  code: number;
}

const DEFAULT_OPTIONS = {
  baseURL: LocalConfig.AxiosBaseUrl,
  timeout: LocalConfig.AxiosTimeout,
  headers: LocalConfig.AxiosHeader
};

const instance = axios.create(DEFAULT_OPTIONS);

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (thrown) => {
    return Promise.reject(thrown);
  }
);

// 封装 axios
export default async function<T = any>(
  options: AxiosRequestConfig
): Promise<ResponseData<T>> {
  const { url } = options;
  const requestOptions = Object.assign({}, options, {
    method: 'post',
    url
  });

  try {
    const { data } = await instance.request<ResponseData<T>>(requestOptions);
    return data;
  } catch (err) {
    throw err;
  }
}
