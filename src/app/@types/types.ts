
type userData = {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
}

type sessionData = {
    id: number,
    cliente: string,
    dispositivo: string,
    data: Date,
}

type deviceData = {
    id: number,
    nome: string,
    imei: string,
    modelo: string,
    fabricante: string,
    cliente_email: string
}

// type para tipagem dos dados do formulário
type LoginFormInputs = {
    email: string;
    senha: string;
}

// type para tipagem dos dados do formulário
type RegisterUserFormInputs = {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
}

type RegisterPartnerFormInputs = {
    cnpj: string;
    nome: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    latitude?: number;
    longitude?: number;
}

// type para tipagem das coordenadas
type Coords = {
    longitude: number;
    latitude: number;
}

// type para tipagem dos dados dos marcadores
type MarkerData = {
    bairro: string;
    cep: string;
    cidade: string;
    cnpj: string;
    complemento: string | null;
    id: number;
    latitude: number;
    logradouro: string;
    longitude: number;
    nome: string;
    numero: string;
    uf: string;
}

// Define a type para o contexto de autenticação
type AuthContextType = {
    isAuth: boolean;
    setIsAuth: (auth: boolean) => void;
}

interface LayoutProps {
    children: React.ReactNode;
    types: string;
}
  