'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLine, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    createUser(input: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'パスワードが一致しません' });
      return;
    }

    try {
      const result = await signup({
        variables: { name: data.name, email: data.email, password: data.password },
      });

      console.log('User created:', result.data.createUser);
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      setError('email', {
        type: 'manual',
        message: '登録に失敗しました。もう一度お試しください。',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-400">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">新規登録</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                id="name"
                type="text"
                placeholder="名前"
                {...register('name', { required: '名前は必須です' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                placeholder="メールアドレス"
                {...register('email', { required: 'メールアドレスは必須です' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                placeholder="パスワード"
                {...register('password', { required: 'パスワードは必須です' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="パスワード（確認）"
                {...register('confirmPassword', { required: 'パスワード（確認）は必須です' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? '登録中...' : '登録'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-black hover:text-blue-700 hover:underline">
              すでにアカウントをお持ちの方はこちら
            </Link>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="#" className="text-black hover:text-blue-700">
              <FontAwesomeIcon icon={faXTwitter} size="2x" />
            </Link>
            <Link href="#" className="text-green-500 hover:text-green-700">
              <FontAwesomeIcon icon={faLine} size="2x" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
