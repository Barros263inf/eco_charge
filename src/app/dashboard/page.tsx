'use client'
import { logout } from "utils/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "context/AuthProvider";
import { useEffect, useState } from "react";

interface userData {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
}

const DashboardPage = () => {
    // Instancia das variuaveis de ambiente
    const API_KEY = process.env.API_KEY;
    const API_URL = process.env.API_URL;

    // Hook do Next.js para navegação
    const router = useRouter();
    // Hook do contexto de autenticação
    const { isAuth } = useAuth();

    const sessionUser = typeof window !== "undefined" ? localStorage.getItem("sessionUser") : "";

    const [userData, setUserData] = useState<userData>();

    const [deviceData, setDeviceData] = useState<any>([]);

    const [sectionData, setSectionData] = useState<any>();


    // Função para lidar com o logout
    const handleLogout = async () => {
        const confirmed = window.confirm("Tem certeza de que deseja sair?");

        if (confirmed) {
            logout();  // Remove o token
            router.push("/login");
            location.reload();
        }
    };

    // Função para carregar dados do usuário
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_URL}/cliente/${sessionUser}`, {
                    headers: {
                        ...(API_KEY && {'X-API-KEY': API_KEY}),
                    },
                });
                const data = await response.json();
                setUserData(data);
                console.log(data);

            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        }
        fetchUserData();

    }, [sessionUser]);

    // Função para carregar dados do dispositivo
    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const response = await fetch(`${API_URL}/dispositivo/${sessionUser}`, {
                    headers: {
                        ...(API_KEY && {'X-API-KEY': API_KEY}),
                    },
                });
                const data = await response.json();
                setDeviceData(data);
                console.log(data);

            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }

        }
        fetchDeviceData();

    }, [sessionUser]);

    // Função para carregar dados da seção
    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                const response = await fetch(`${API_URL}/secao/${sessionUser}`, {
                    headers: {
                        ...(API_KEY && {'X-API-KEY': API_KEY}),
                    },
                });
                const data = await response.json();
                setSectionData(data);
                console.log(data);
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        }
        fetchSectionData();
    },[sessionUser]);

    useEffect(() => {
        // Se o usuário não estiver autenticado, redireciona para o login
        if (!isAuth) {
            router.push("/login");
        }
    }, [isAuth, router]);


    return (
        <div className="wrapper">
            <section id="dashboard">
                <div className="card-user-info">
                    <img src="/icons/icon-user.png" alt="Icone de usuário" />
                    {
                        userData &&
                        <div>
                            <p>Nome: {userData.nome}</p>''
                            <p>Email: {userData.email}</p>
                        </div>
                    }
                </div>
                <div className="card-user-info">
                    <h2>Seus dispositivos</h2>
                    {
                        deviceData &&
                        <div>
                            <p>Nome: {deviceData?.nome}</p>
                            <p>Email: {deviceData?.modelo}</p>
                        </div>
                    }
                </div>
                <div className="card-user-info">
                    <h2>Suas ultimas seções de carregamento</h2>
                    {
                        sectionData &&
                        <div>
                            <p>Data: {sectionData?.data}</p>
                        </div>
                    }
                </div>
                <button onClick={handleLogout} className="button">logout</button>
            </section>
        </div>
    );
};

export default DashboardPage;