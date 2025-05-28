export interface User {
    isLoggedIn: boolean;
    name: string;
    profileImage?: string;
    email: string;
    role: string;
    createdAt?: string;
    modifiedAt?: string;
}
