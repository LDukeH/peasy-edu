import Axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { initMocks, isMockingEnabled } from "@/mocks/init";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: "", // Đi qua Next.js rewrite (/api/...)
  withCredentials: true,
});

const AUTH_NO_RETRY_PATHS = [
  "/api/auth/refresh",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !AUTH_NO_RETRY_PATHS.some((p) => originalRequest.url?.includes(p))
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => AXIOS_INSTANCE(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await AXIOS_INSTANCE.post("/api/auth/refresh");
        processQueue(null);
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:unauthorized"));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const controller = new AbortController();
  const execute = () =>
    AXIOS_INSTANCE({
      ...config,
      ...options,
      signal: controller.signal,
    }).then(({ data }) => data);

  const promise: Promise<T> = isMockingEnabled
    ? initMocks().then(execute)
    : execute();

  // @ts-expect-error Gắn hàm cancel cho TanStack Query
  promise.cancel = () => controller.abort();
  return promise;
};
