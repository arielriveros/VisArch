import { useAuthContext } from "./useAuthContext";

export function useLogout() { 
    const { dispatch } = useAuthContext();

    function logout(): void {
        localStorage.removeItem('user');
        window.location.reload();
        dispatch({type: "LOGOUT"});
    }

    return { logout };
}