import { ENV } from "../conf/env";
import { useAuthStore } from "./auth.store";


export const login = async (username, password) => {
    const { setAuth, setLoading } = useAuthStore.getState();

    try {
        setLoading(true);

        const body = new URLSearchParams();
        body.append("grant_type", "password");
        body.append("username", username);
        body.append("password", password);
        body.append("scope", "");
        body.append("client_id", "string");
        body.append("client_secret", "string");

        const response = await fetch(`${ENV.API_URL}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                accept: "application/json",
            },
            body,
        });

        if (!response.ok) throw new Error("Credenciales inválidas");

        const data = await response.json();

        // data = { access_token, token_type }

        localStorage.setItem("token", data.access_token);
        setAuth(data)

        //await checkAuth(data.access_token);

    } catch (error) {
        console.error(error);
        setLoading(false);
        throw error;
    }
};

export const logout = () => {
    const { clearAuth } = useAuthStore.getState();
    localStorage.removeItem("token");
    clearAuth();
};

export const checkAuth = async (customToken = null) => {
    const token = customToken || localStorage.getItem("token");
    if (!token) return;

    const { setAuth } = useAuthStore.getState();

    try {
        const response = await fetch(`${ENV.API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error();

        const user = await response.json();

        setAuth(user, token);
    } catch {
        logout();
    }
};
