export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    userId: number;
}