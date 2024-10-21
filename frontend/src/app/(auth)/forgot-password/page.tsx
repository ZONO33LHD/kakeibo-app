'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    // ここにパスワードリセットのロジックを実装
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-400">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">パスワードをお忘れの方</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                placeholder="メールアドレス"
                {...register('email', { required: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              パスワードリセット用メールを送信
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-black hover:text-blue-700 hover:underline">
              ログイン画面に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
