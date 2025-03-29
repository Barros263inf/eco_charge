'use client'
import { logout } from "utils/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "context/AuthProvider";
import { useEffect, useState } from "react";
import apiHandller from "utils/apiHandller";

const DashboardPage = () => {

    // Hook do Next.js para navegação
    const router = useRouter();
    // Hook do contexto de autenticação
    const { isAuth } = useAuth();

    const sessionUser = typeof window !== "undefined" ? localStorage.getItem("sessionUser") : "";

    const [userData, setUserData] = useState<userData>();

    const [deviceData, setDeviceData] = useState<deviceData>();

    const [sectionData, setSectionData] = useState<sessionData>();


    // Função para lidar com o logout
    const handleLogout = async () => {
        const confirmed = window.confirm("Tem certeza de que deseja sair?");

        if (confirmed) {
            logout();  // Remove o token
            router.push("/login");
            location.reload();
        }
        // Se o usuário não estiver autenticado, redireciona para o login
        if (!isAuth) {
            router.push("/login");
        }
    };

    useEffect(() => {
        // Se o usuário não estiver autenticado, redireciona para o login
        if (!isAuth) {
            router.push("/login");
        }
    }, [isAuth, router]);

    // Função para carregar dados do usuário
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const responseUser = await apiHandller(`/cliente/${sessionUser}`, "GET");
                //console.log(responseUser);
                setUserData(responseUser);

                const responseDevice = await apiHandller(`/dispositivo/${sessionUser}`,"GET");
                //console.log(responseDevice);
                setDeviceData(responseDevice);
                
                const responseSession = await apiHandller(`/sessao/${sessionUser}`,"GET");
                //console.log(responseSession);
                setSectionData(responseSession);

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        }
        fetchUserData();
    }, [sessionUser]);

    return (
        <div className="wrapper">
            <section id="dashboard">
                <div className="card-user-info">
                    <img src="/icons/icon-user.png" alt="Icone de usuário" />
                    {
                        userData &&
                        <div>
                            <p>Nome: {userData.nome}</p>
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
                            <p>Modelo: {deviceData?.modelo}</p>
                        </div>
                    }
                </div>
                <div className="card-user-info">
                    <h2>Suas ultimas seções de carregamento</h2>
                    {
                        sectionData &&
                        <div>

                            <p>Data: {sectionData.dispositivo}</p>
                        </div>
                    }
                </div>
                <button onClick={handleLogout} className="button">logout</button>
            </section>
        </div>
    );
};

export default DashboardPage;