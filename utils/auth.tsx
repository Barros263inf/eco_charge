export const login = async (email: string, password: string) => {

    if (email === 'admin@admin.com' && password === 'admin') {
        alert('Efetuando Login...')
        localStorage.setItem("authToken", "validToken"); //Simulando o armazenamento de um token
        localStorage.setItem("sessionUser", email);
        return true;
    } else {
        return false;
    }

    const res = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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
