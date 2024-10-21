/**
 * ログインページ
 * ログインフォームを表示する
 * ログインボタンをクリックすると、ログイン処理を行う
 * ログイン処理が成功したら、ホームページに遷移する
 * ログイン処理が失敗したら、エラーメッセージを表示する
 */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLine, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function Login() {
  const [login] = useMutation(LOGIN_MUTATION);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const onSubmit = async (data: any) => {
    try {
      const result = await login({ variables: { email: data.email, password: data.password } });
      const { token, user } = result.data.login;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      router.push('/top-page');
    } catch (error) {
      console.error('Login failed:', error);
      alert('ログインに失敗しました');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-400">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">ログイン</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                type="text"
                placeholder="メールアドレス"
                {...register('email')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                placeholder="パスワード"
                {...register('password')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ログイン
            </button>
          </form>
          <div className="mt-6 text-center">
            <a
              href="forgot-password"
              className="text-sm text-black hover:text-blue-700 hover:underline"
            >
              パスワードを忘れた方はこちら
            </a>
          </div>
          <div className="mt-8 text-center">
            <Link href="/signup" className="text-black hover:text-blue-700 hover:underline">
              新規登録はこちら
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
