'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from 'context/AuthProvider';
import { login } from 'utils/auth';

// Schema de validação
const schema = yup.object({
  email: yup.string()
    .required('E-mail é obrigatório')
    .email('Digite um e-mail válido'),
  senha: yup.string()
    .required('Senha é obrigatória')
});

// Interface para tipagem dos dados do formulário
interface IFormInputs {
  email: string;
  senha: string;
}

const LoginPage = () => {

  // Hook do Next.js para navegação
  const router = useRouter();

  // Hook do contexto de autenticação
  const { isAuth } = useAuth();

  // Hook do React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: IFormInputs) => {

    const isSuccess = login(data.email, data.senha);

    if (await isSuccess) {
      router.push('/dashboard');
      location.reload();
    } else {
      alert('Email ou senha inválidos');
    }
  };

  useEffect(() => {
    if (isAuth) {
      router.push("/dashboard")
    }
  }, [isAuth, router])

  return (
    <section className='container'>
      <div className="wrapper">
        <form id='form-login' onSubmit={handleSubmit(onSubmit)}>
          <h2>Entre na sua conta</h2>
          <p>
            Ou{' '}
            <Link href="/cadastro-usuario" className="font-medium text-indigo-600 hover:text-indigo-500">
              cadastre-se gratuitamente
            </Link>
          </p>

          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
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
              autoComplete="current-password"
              {...register('senha')}
              className="input"
            />
            {errors.senha && (
              <p className="error">{errors.senha.message}</p>
            )}
          </div>
          <Link href="/forgot-password" className="link">Esqueceu sua senha?</Link>
          <button type="submit" className="button"> Entrar</button>

        </form>
      </div>
    </section>
  );
}

export default LoginPage;