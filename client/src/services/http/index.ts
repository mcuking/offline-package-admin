import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import LocalConfig from '@/config.json';

interface ResponseData<T> {
  data: T;
  errorCode: number;
  errorMessage: string;
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
  (error) => {
    return Promise.reject(error);
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
    const {
      data,
      data: { errorMessage }
    } = await instance.request<ResponseData<T>>(requestOptions);
    if (errorMessage) {
      message.error(errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
