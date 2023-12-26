import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_ENDPOINT } from "../../../common/api/Endpoints";

export function useRegister() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { dispatch } = useAuthContext();

    async function register(username: string, email: string, password: string) {
        setError(null)
        setLoading(true)

        const response = await fetch(`${API_ENDPOINT()}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
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

    return { register, loading, error }
}