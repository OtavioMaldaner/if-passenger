import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { JWTToken } from "./types";

export function salvarTokenNoCookie(token: string): boolean {
    try {
        const decodedToken: JWTToken = jwtDecode(token);
        const expiress = new Date(decodedToken.exp * 1000).toString();
        document.cookie = `user_token=${token}; path=/; expires=${expiress};`;
        return true;
    } catch (error) {
        return false;
    }
}

export function getDecodedToken(): JWTToken | any {
    const token = Cookie.get("user_token");
    if (token) {
        try {
            const decodedToken: JWTToken = jwtDecode(token);
            if (decodedToken) {
                return decodedToken;
            }
        } catch (error) {
            return error;
        }
    }
    return;
}

export function logOut(): void {
    document.cookie = 'user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}