'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import Popup from 'components/Popup';
import { useAuth } from 'context/AuthProvider';

// Definindo o schema de validação com Yup
const schema = yup.object({
  nome: yup.string()
    .required('Nome é obrigatório')
    .min(5, 'Nome deve ter pelo menos 5 caracteres'),
  sobrenome: yup.string()
    .required('Sobrenome é obrigatório')
    .min(5, 'Sobrenome deve ter pelo menos 5 caracteres'),
  email: yup.string()
    .required('E-mail é obrigatório')
    .email('Digite um e-mail válido'),
  senha: yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(12, 'Senha deve ter no máximo 12 caracteres')
});

// Interface para tipagem dos dados do formulário
interface IFormInputs {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
}

const CadastroUsuarioPage = () => {
  // Instancia das variuaveis de ambiente
  const API_KEY = process.env.API_KEY;
  const API_URL = process.env.API_URL;

  // Estado de autenticação
  const { isAuth } = useAuth();

  // Hook do React Hook Form
  const router = useRouter();

  // Estado para exibir o popup de sucesso
  const [showPopup, setShowPopup] = useState(false);

  // Hook do Yup para validação
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: IFormInputs) => {

    const response = await fetch(`${API_URL}/cliente`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        //...(API_KEY && {"X-API-KEY": API_KEY}), 
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      setShowPopup(true);
    } else {
      console.log('Erro ao cadastrar usuário');
    }
  };

  // Efeito para lidar com o estado do popup
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

  // Efeito para redirecionar caso o usuário esteja autenticado
  useEffect(() => {
    if (isAuth) {
      router.push('/dashboard');
    }
  }, [isAuth, router]);


  return (
    <section className='container'>
      <div className="wrapper">
        <form id='form-user' onSubmit={handleSubmit(onSubmit)}>
          <h2 >Criar sua conta</h2>

          <div>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              {...register('nome')}
              className="input"
            />
            {errors.nome && (
              <p className="error">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label>Sobrenome</label>
            <input
              id="sobrenome"
              type="text"
              {...register('sobrenome')}
              className="input"
            />
            {errors.sobrenome && (
              <p className="error">{errors.sobrenome.message}</p>
            )}
          </div>

          <div>
            <label>E-mail</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="input"
            />
            {errors.email && (
              <p className="error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              {...register('senha')}
              className="input"
            />
            {errors.senha && (
              <p className="error">{errors.senha.message}</p>
            )}
          </div>

          <button type="submit" className="button">Cadastrar</button>
        </form>
        {showPopup && (<Popup />)}
      </div>
    </section>
  );
}

export default CadastroUsuarioPage;