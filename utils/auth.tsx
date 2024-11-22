export const login = async (email: string, senha: string) => {
    alert('Verificando credenciais...')
    const res = await fetch('http://127.0.0.1:5000/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
