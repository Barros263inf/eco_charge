const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiHandller = async (resorce: string, method: string, data?:any) => {
    try {
        const response = await fetch(`${API_URL}/${resorce}`, {
            method: `${method.toUpperCase}`,
            headers: {
               "Content-Type":"application/json",
                ...(API_KEY && {"X-API-KEY": API_KEY})
            },
            body: JSON.stringify(data)
            
        });
        
        if (response.ok) {
            return response
        } else {
            return JSON.stringify({"Erro": "Dados indisponiveis..."})
        }
        
    } catch (e) {
        console.log(e);
    }
}

export default apiHandller;