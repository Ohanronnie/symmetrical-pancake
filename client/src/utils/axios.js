import _axios from "axios";
export const axios = _axios.create({
  baseURL: import.meta.env["VITE_BACKEND_URL"],
  withCredentials: true,
  timeout: 1000 * 60 * 60 * 24,
});
axios.interceptors.request.use(
  async (config, ...rest) => {
    const tokens = {
      spa: window.spa,
      app_associate: window.app_associate,
      req_id: window.req_id,
    };
    config.headers = {
      ...config.headers,
      token: localStorage.getItem("token"),
    };
    if (config.method === "post") {
      if (config.data instanceof FormData) {
        for (let key in tokens) {
          console.log(key, tokens[key]);
          config.data.append(key, tokens[key]);
        }
      } else {
        config.data = Object.assign({}, config.data, tokens);
      }
    } else {
      config.headers = { ...config.headers, ...tokens };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
