import axios, { AxiosInstance, AxiosResponse } from "axios";

interface CustomAxiosInstance extends AxiosInstance {
    accessToken?: string;
}

export const authNodeAxios: CustomAxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_NODE_URL,
    withCredentials: true
})

authNodeAxios.interceptors.request.use(
    async (config: any): Promise<any> => {
        const accessToken = authNodeAxios.accessToken;
        if (!accessToken) {
            return Promise.reject(new Error("No access token provided"));
        }
        config.headers = {
            Authorization: "Bearer " + accessToken,
            Accept: "application/json"
        };
        return config;
    },
    (error) => Promise.reject(new Error(error))
)

authNodeAxios.interceptors.response.use(
    async (response: AxiosResponse): Promise<AxiosResponse> => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error?.response?.status === 403 && !originalRequest._retry) {
            try {
                originalRequest._retry = true;
                const result = await refreshAccessToken();
                authNodeAxios.accessToken = result?.accessToken;

                return authNodeAxios(originalRequest);
            } catch (err: any) {
                if (err?.response && err?.response?.data) {
                    return Promise.reject(err?.response?.data);
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
)

const refreshAccessToken = async () => {
    try {
        const response = await axiosPublic.get("/auth/session");
        return response.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}

export const axiosPublic: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true
})

export const authAxios: CustomAxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true
})

authAxios.interceptors.request.use(
    async (config: any): Promise<any> => {
        const accessToken = authAxios.accessToken;
        if (!accessToken) {
            return Promise.reject(new Error("No access token provided"));
        }
        config.headers = {
            Authorization: "Bearer " + accessToken,
            Accept: "application/json"
        };
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error))
    }
)

authAxios.interceptors.response.use(
    async (response: AxiosResponse): Promise<AxiosResponse> => {
        return response;
    },
    async function (error: any): Promise<any> {
        const originalRequest = error.config;
        if (error?.response?.status === 403 && !originalRequest._retry) {
            try {
                originalRequest._retry = true;
                const result = await refreshAccessToken();
                authAxios.accessToken = result?.accessToken;
                return authAxios(originalRequest)
            } catch (err: any) {
                if (err?.response && err?.response?.data) {
                    return Promise.reject(err?.response?.data);
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
)