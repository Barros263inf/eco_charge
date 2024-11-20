import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from 'lucide-react';

const CadastroConcluidoPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon 
              className="text-green-500" 
              size={100} 
            />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Cadastro Concluído com Sucesso!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Seu cadastro foi realizado. Agora você pode acessar todas as funcionalidades.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar para o inicio
            </Link>
            
            <Link 
              href="/login"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Fazer Login
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Enviamos um e-mail de confirmação para sua caixa de entrada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroConcluidoPage;