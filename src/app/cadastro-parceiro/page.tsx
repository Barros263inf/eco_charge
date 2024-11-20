'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IMaskInput } from 'react-imask'
import { useRouter } from 'next/navigation';

// Schema de validação
const schema = yup.object({
    cnpj: yup.string()
        .required('CNPJ é obrigatório')
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
    nomeEmpresa: yup.string()
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
    estado: yup.string().required('Estado é obrigatório')
});

// Interface para tipagem dos dados do formulário
interface IFormInputs {
    cnpj: string;
    nomeEmpresa: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;

}

const CadastroParceiroPage = () => {

    const router = useRouter();

    // Estado para armazenar os dados do formulário
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema)
    });

    // Estado para armazenar o cep para buscar latitude e longitude
    const [cep, setCep] = useState('');

    // Estado para armazenar o número para buscar latitude e longitude
    const [numero, setNumero] = useState('');

    // Estado para armazenar os dados do endereço
    const [enderecoData, setEnderecoData] = useState({
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''
    });

    const buscarLongLat = async () => {
        const baseUrl = 'https://nominatim.openstreetmap.org/search';
        const params = new URLSearchParams({
            q: enderecoData.logradouro + ' ' + numero + ', ' + enderecoData.bairro + ', ' + enderecoData.cidade + ', ' + enderecoData.estado,
            format: 'json',
            addressdetails: '1',
            limit: '1',
        });

        try {
            const response = await fetch(`${baseUrl}?${params}`);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
        }
        buscarLongLat();
    };

    // Função para buscar o endereço com base no CEP
    const buscarCEP = async (cep: string) => {
        setCep(cep);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setValue('logradouro', data.logradouro);
                setValue('bairro', data.bairro);
                setValue('cidade', data.localidade);
                setValue('estado', data.uf);

                setEnderecoData({
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf
                });
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    };


    // Função para lidar com a submissão do formulário
    const onSubmit = (data: IFormInputs) => {
        console.log(data);
        router.push('/cadastro-concluido');
        // Aqui você pode adicionar a lógica para enviar os dados para o backend
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Cadastro de Empresa
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                                    CNPJ
                                </label>
                                <div className="mt-1">

                                    <IMaskInput
                                        mask="00.000.000/0000-00"
                                        id="cnpj"
                                        type="text"
                                        {...register('cnpj')}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />

                                    {errors.cnpj && (
                                        <p className="mt-2 text-sm text-red-600">{errors.cnpj.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700">
                                    Nome da Empresa
                                </label>

                                <div className="mt-1">
                                    <input
                                        id="nomeEmpresa"
                                        type="text"
                                        {...register('nomeEmpresa')}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.nomeEmpresa && (
                                        <p className="mt-2 text-sm text-red-600">{errors.nomeEmpresa.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                                    CEP
                                </label>
                                <div className="mt-1">
                                    <IMaskInput
                                        mask="00000-000"
                                        id="cep"
                                        type="text"
                                        {...register('cep')}
                                        onAccept={(value) => buscarCEP(value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.cep && (
                                        <p className="mt-2 text-sm text-red-600">{errors.cep.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">
                                    Logradouro
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="logradouro"
                                        type="text"
                                        {...register('logradouro')}
                                        value={enderecoData.logradouro}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.logradouro && (
                                        <p className="mt-2 text-sm text-red-600">{errors.logradouro.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                                    Número
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="numero"
                                        type="text"
                                        {...register('numero')}
                                        onChange={(e) => setNumero(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.numero && (
                                        <p className="mt-2 text-sm text-red-600">{errors.numero.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                                    Complemento
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="complemento"
                                        type="text"
                                        {...register('complemento')}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                                    Bairro
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="bairro"
                                        type="text"
                                        {...register('bairro')}
                                        value={enderecoData.bairro}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.bairro && (
                                        <p className="mt-2 text-sm text-red-600">{errors.bairro.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                                    Cidade
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="cidade"
                                        type="text"
                                        {...register('cidade')}
                                        value={enderecoData.cidade}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.cidade && (
                                        <p className="mt-2 text-sm text-red-600">{errors.cidade.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                                    Estado
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="estado"
                                        type="text"
                                        {...register('estado')}
                                        value={enderecoData.estado}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.estado && (
                                        <p className="mt-2 text-sm text-red-600">{errors.estado.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cadastrar Empresa
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CadastroParceiroPage;