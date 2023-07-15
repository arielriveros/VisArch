import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { config } from "../utils/config";

export function useLogin() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { dispatch } = useAuthContext();

    async function login(username: string, password: string) {
        setError(null)
        setLoading(true)

        const response = await fetch(`${config.API_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const jsonResponse = await response.json();
        
        if (!response.ok) {
            console.error(jsonResponse.msg);
            setError(jsonResponse.msg);
            setLoading(false);
        }
        else {
            setError(null);
            // Save user to local storage
            localStorage.setItem('user', JSON.stringify(jsonResponse));
            // Set user in context
            dispatch({type: "LOGIN", payload: jsonResponse});
            setLoading(false);
        }
    }

    return { login, loading, error }
}