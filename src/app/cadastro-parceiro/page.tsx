'use client'
import React, { useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IMaskInput } from 'react-imask'
import { useRouter } from 'next/navigation';
import Popup from 'components/Popup';

// Schema de validação
const schema = yup.object({
    cnpj: yup.string()
        .required('CNPJ é obrigatório')
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
    nome: yup.string()
        .required('Nome da empresa é obrigatório')
        .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
    cep: yup.string()
        .required('CEP é obrigatório')
        .matches(/^\d{5}-\d{3}$/, 'CEP inválido'),
    logradouro: yup.string().required('Logradouro é obrigatório'),
    numero: yup.string().required('Número é obrigatório'),
    complemento: yup.string(),
    bairro: yup.string().required('Bairro é obrigatório'),
    cidade: yup.string().required('Cidade é obrigatória'),
    uf: yup.string().required('Estado é obrigatório')
        .max(2, 'UF deve ter 2 caracteres')
});

// Interface para tipagem dos dados do formulário
interface IFormInputs {
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

const CadastroParceiroPage = () => {
    // Instancia das variuaveis de ambiente
    const API_KEY = process.env.API_KEY;
    const API_URL = process.env.API_URL;

    // Hook do Next.js para navegação
    const router = useRouter();

    // Estado para armazenar os dados do formulário
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema)
    });

    // Estado para exibir o popup de sucesso
    const [showPopup, setShowPopup] = useState(false);

    // Estado para armazenar o cep para buscar latitude e longitude
    const [cep, setCep] = useState('');

    // Estado para armazenar o número para buscar latitude e longitude
    const [numero, setNumero] = useState('');

    // Estado para exibir os dados no formulário
    const [latitude, setLatitude] = useState(0);

    const [longitude, setLongitude] = useState(0);


    // Estado para armazenar os dados do endereço para exibir no formulário
    const [enderecoData, setEnderecoData] = useState({
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''
    });

    // Função para buscar latitude e longitude para adicionar marcadores ao mapa
    const buscarLongLat = async () => {
        //alert('Buscando latitude e longitude...' + enderecoData.logradouro + ' ' + cep + ' ' + numero);
        const baseUrl = 'https://nominatim.openstreetmap.org/search';
        const params = new URLSearchParams({
            q: enderecoData.logradouro + ' ' + numero + ', ' + enderecoData.cidade,
            format: 'json',
            addressdetails: '1',
            limit: '1',
        });

        try {
            const response = await fetch(`${baseUrl}?${params}`,
                {
                    method: 'GET',
                    headers: { 'User-Agent': 'EcoCharge' }
                });
            const data = await response.json();
            if (data.length > 0) {
                setValue('latitude', parseFloat(data[0].lat));
                setValue('longitude', parseFloat(data[0].lon));
                setLatitude(parseFloat(data[0].lat));
                setLongitude(parseFloat(data[0].lon));
            }
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
        }
    };

    // Função para buscar o endereço com base no CEP
    const buscarCEP = async (cep: string) => {

        setCep(cep.replace(/\D/g, ''));

        if (cep.length === 9) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setValue('logradouro', data.logradouro);
                    setValue('bairro', data.bairro);
                    setValue('cidade', data.localidade);
                    setValue('uf', data.uf);

                    setEnderecoData({
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf
                    });
                }

                buscarLongLat();

            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    // Função para lidar com a submissão do formulário
    const onSubmit = async (data: IFormInputs) => {

        try {
            const response = await fetch(`${API_URL}/estabelecimento`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(API_KEY && {'X-API-KEY': API_KEY}),
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                console.log("Formulário enviado com sucesso!");
                setShowPopup(true);
            } else {
                console.error("Erro ao enviar o formulário.");
            }

        } catch (error) {
            console.error("Erro ao enviar o formulário:", error);
        }
    };

    useEffect(() => {
        if (showPopup) {
            // Bloqueia o scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Restaura o scroll
            document.body.style.overflow = 'auto';
        }

        // Cleanup para restaurar o scroll se o componente for desmontado
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showPopup]);


    return (
        <section className='container'>
            <div className="wrapper">
                
                <form id='form-parceiro' onSubmit={handleSubmit(onSubmit)}>
                    <h2>Cadastro de Empresa</h2>

                    <div className="row">
                        <div>
                            <label htmlFor="cnpj">CNPJ</label>
                            <IMaskInput
                                mask="00.000.000/0000-00"
                                id="cnpj"
                                type="text"
                                onAccept={(value: any) => setValue('cnpj', value)}
                                {...register('cnpj')}
                                className="input"
                            />

                            {errors.cnpj && (
                                <p className="error">{errors.cnpj.message}</p>
                            )}

                        </div>

                        <div>
                            <label htmlFor="nomeEmpresa">Nome da Empresa</label>
                            <input
                                id="nomeEmpresa"
                                type="text"
                                {...register('nome')}
                                className="input"
                            />
                            {errors.nome && (
                                <p className="error">{errors.nome.message}</p>
                            )}

                        </div>
                    </div>

                    <div className="row">
                        <div>
                            <label htmlFor="cep">CEP</label>

                            <IMaskInput
                                mask="00000-000"
                                id="cep"
                                type="text"
                                onAccept={(value) => {
                                    setValue('cep', value);
                                    buscarCEP(value)
                                }}
                                {...register('cep')}
                                className="input"
                            />
                            {errors.cep && (
                                <p className="error">{errors.cep.message}</p>
                            )}

                        </div>

                        <div>
                            <label htmlFor="logradouro">Logradouro</label>

                            <input
                                id="logradouro"
                                type="text"
                                value={enderecoData.logradouro}
                                {...register('logradouro')}
                                className="input"
                                readOnly
                            />
                            {errors.logradouro && (
                                <p className="error">{errors.logradouro.message}</p>
                            )}

                        </div>
                    </div>

                    <div className="row">
                        <div>
                            <label htmlFor="numero">Número</label>
                            <input
                                id="numero"
                                type="text"
                                {...register('numero')}
                                onChange={(e) => {
                                    setValue('numero', e.target.value)
                                    setNumero(e.target.value)
                                }}
                                className='input'
                            />
                            {errors.numero && (
                                <p className="error">{errors.numero.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="complemento">
                                Complemento
                            </label>

                            <input
                                id="complemento"
                                type="text"
                                {...register('complemento')}
                                className="input"
                            />
                        </div>

                        <div>
                            <label htmlFor="bairro"> Bairro</label>
                            <input
                                id="bairro"
                                type="text"
                                value={enderecoData.bairro}
                                {...register('bairro')}
                                className="input"
                                readOnly
                            />
                            {errors.bairro && (
                                <p className="error">{errors.bairro.message}</p>
                            )}

                        </div>
                    </div>

                    <div className="row">
                        <div>
                            <label htmlFor="cidade">Cidade</label>

                            <input
                                id="cidade"
                                type="text"
                                {...register('cidade')}
                                value={enderecoData.cidade}
                                className="input"
                                readOnly
                            />
                            {errors.cidade && (
                                <p className="error">{errors.cidade.message}</p>
                            )}

                        </div>

                        <div>
                            <label htmlFor="estado">Estado</label>
                            <input
                                id="estado"
                                type="text"
                                {...register('uf')}
                                value={enderecoData.estado}
                                className="input"
                                readOnly
                            />
                            {errors.uf && (
                                <p className="error">{errors.uf.message}</p>
                            )}

                        </div>
                    </div>

                    <div className='row'>
                        <div>
                            <label htmlFor="longitude">Longitude</label>
                            <input
                                id="longitude"
                                type="number"
                                {...register('longitude')}
                                value={longitude}
                                className="input"
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                id="latitude"
                                type='number'
                                {...register('latitude')}
                                value={latitude}
                                className="input"
                                readOnly
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="button"
                    >
                        Cadastrar Empresa
                    </button>

                </form>

                {showPopup && (<Popup />)}

            </div>
        </section>

    );
}

export default CadastroParceiroPage;