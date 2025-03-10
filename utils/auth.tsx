export const login = async (email: string, senha: string) => {

    // Instancia das variuaveis de ambiente
    //const API_KEY = process.env.API_KEY;
    const API_URL = process.env.API_URL;

    alert('Verificando credenciais...')
    const res = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            //...(API_KEY && {'X-API-KEY': API_KEY}),
        },
        body: JSON.stringify({ email, senha })
    })

    if (res.ok) {
        alert('Efetuando Login...')
        localStorage.setItem("authToken", "validToken"); //Simulando o armazenamento de um token
        localStorage.setItem("sessionUser", email);
        return true;
    } else {
        return false;
    }
}

//Retorna o estado de autenticação atual
export const isAuthenticated = () => {
    return typeof window !== 'undefined' && localStorage.getItem("authToken") !== null;
}

//
export const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("sessionUser")

}
