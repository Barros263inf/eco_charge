import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from 'lucide-react';

const CadastroConcluidoPage = () => {
  return (
    <div id='popup-container'>
      <div id='popup-card'>
        <CheckCircleIcon
          className="text-green-500"
          size={100}
        />
        <h2>Cadastro Concluído com Sucesso!</h2>

        <p>
          Seu cadastro foi realizado. Agora você pode acessar todas as funcionalidades.
        </p>

        <div className='container-buttons'>
          <Link
            href="/"
            className="button"
          >
            Voltar para o inicio
          </Link>

          <Link
            href="/login"
            className="button-bg-w"
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
  );
}

export default CadastroConcluidoPage;