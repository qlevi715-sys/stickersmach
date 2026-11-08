import { API_URL } from "@/api/ApiClient";
import axios from "axios";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 15000
});

let unauthorizedHandler: (() => void) | null = null;

/** AuthContext registra aquí su clearSession (y lo desregistra al desmontarse). */
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
    unauthorizedHandler = handler;
};

const EXCLUDED_PATHS = ["/auth/login"];

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url: string = error?.config?.url ?? "";
        const isExcluded = EXCLUDED_PATHS.some((path) => url.includes(path));

        if (status === 401 && !isExcluded) {
            unauthorizedHandler?.();
            console.log("401 detectado: cerrando sesión");
        }

        return Promise.reject(error);
    }
);