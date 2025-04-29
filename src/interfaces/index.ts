export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

export interface Cliente {
    id: number;
    userId: number;
    zipcode: string;
    street: string;
    number: string;
    complement?: string;
    city: string;
    estate: string;
    cpf: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Parceiro {
    id: number;
    userId: number;
    zipcode: string;
    street: string;
    number: string;
    complement?: string;
    city: string;
    estate: string;
    cpf: string;
    cnpj?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    userId: number;
}