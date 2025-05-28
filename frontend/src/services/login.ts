import { jwtDecode } from 'jwt-decode';
import { User } from '../types/User';

export function googleLoginService(jwt: string): User {
    localStorage.setItem('googleToken', jwt);
    let decoded = jwtDecode(jwt);

    let user: User = {
        isLoggedIn: true,
        name: decoded.name || '',
        email: decoded.email || '',
        role: decoded.role || ''
    };

    console.log(user);
    
    return user;
}

export function googleSignupService(jwt: string): User {
    localStorage.setItem('googleToken', jwt);
    let decoded = jwtDecode(jwt);

    let user: User = {
        isLoggedIn: true,
        name: decoded.name || '',
        email: decoded.email || '',
        role: decoded.role || ''
    };

    return user;
}

export function logoutService() {
    localStorage.removeItem('googleToken');
}