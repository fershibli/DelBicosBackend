export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

export interface Endereco {
    zipcode: string;
    street: string;
    number: string;
    complement?: string;
    city: string;
    estate: string;
}

export interface Cliente extends Endereco {
    id: number;
    userId: number;
    cpf: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Parceiro extends Endereco {
    id: number;
    userId: number;
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

export interface AgendaParceiro {
    id: number;
    partnerId: number;
    availableDays: string[];
    workingHours: {
        start: string; 
        end: string;
    };
    description:string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Agendamento {
    id: number;
    serviceIds: number[];
    clientId: number;
    agendaId: number;
    partnerId: number;
    specialtyId: number;
    availableDate: Date;
    startTime: string;
    endTime: string;
    description: string;
    value: string;
    status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';
    createdAt?: Date;
    updatedAt?: Date;
}