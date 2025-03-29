const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiHandller = async (resorce: string, method: string, data?:any) => {
    console.log(data);

    switch(method){
        case "GET":
            try {
                const response = await fetch(`${API_URL}/${resorce}`, {
                    method: `${method.toUpperCase()}`,
                    headers: {
                       "Content-Type":"application/json",
                        ...(API_KEY && {"X-API-KEY": API_KEY})
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    console.log("ok");
                    
                    return response.json()
                } else {
                    console.log("erro");
                    
                    return JSON.stringify({"\Erro": `Dados ${resorce}  indisponiveis...`})
                }
            } catch (e) {
                console.log(e);
            }
            break;
        case "POST":
            try {
                
                const check = await fetch(`${API_URL}/${resorce}/${data?.email || data?.cnpj}`)

                if (check.ok){
                    alert("Já está em uso.");
                    return false;
                } else {
                    const response = await fetch(`${API_URL}/${resorce}`, {
                    method: `${method.toUpperCase()}`,
                    headers: {
                       "Content-Type":"application/json",
                        ...(API_KEY && {"X-API-KEY": API_KEY})
                    },
                    body: JSON.stringify(data)
                    });
                
                    if (response.ok) {
                        console.log("ok");
                        
                        return response.json()
                    } else {
                        console.log("erro");
                        
                        return JSON.stringify({"\Erro": `Dados ${resorce}  indisponiveis...`})
                    }
                }
            } catch (e) {
                console.log(e);
            }
            break;
        case "DELETE":
            break;
        case "PUT":
            break;
    }
}

export default apiHandller;