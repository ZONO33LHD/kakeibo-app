import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from './gqls/query';
import { useFinancial } from './FinancialContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

type TransactionType = 'income' | 'expense';

const categoryIds = {
  income: {
    給与: 1,
    副収入: 2,
    投資: 3,
    その他: 4,
  },
  expense: {
    食費: 5,
    住居費: 6,
    交通費: 7,
    娯楽費: 8,
    医療費: 9,
    教育費: 10,
    光熱費: 11,
    その他: 12,
  },
};

export default function TransactionForm() {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<{ id: string; name: string } | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [createTransaction] = useMutation(CREATE_TRANSACTION);
  const { fetchFinancialData } = useFinancial();

  useEffect(() => {
    setDate(new Date());
  }, []);

  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !amount || !category || !date) {
      alert('全ての項目を入力してください。');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      alert('ユーザーIDが見つかりません。再度ログインしてください。');
      return;
    }

    const typeKey = type.toUpperCase();

    try {
      const result = await createTransaction({
        variables: {
          input: {
            userId: userId,
            title: title,
            amount: parseFloat(amount),
            type: typeKey,
            categoryId: category?.id || 0,
            date: date.toISOString(),
            isRecurring: false,
          },
        },
      });

      console.log('取引が正常に保存されました:', result.data.createTransaction);

      // フォームをリセット
      setTitle('');
      setAmount('');
      setCategory(null);
      setDate(new Date());

      // 収支データを更新
      await fetchFinancialData({ startDate: new Date(), endDate: new Date() });

      alert('取引が正常に保存されました。');
    } catch (error) {
      console.error('取引の保存中にエラーが発生しました:', error);
      alert('取引の保存中にエラーが発生しました。');
    }
  };

  const handleCategoryClick = (id: string, name: string) => {
    if (category && category.id === id) {
      // 同じカテゴリが選択された場合、選択を解除
      setCategory(null);
    } else {
      // 新しいカテゴリを選択
      setCategory({ id, name });
    }
  };

  const renderDateSelector = () => (
    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <span>{date ? format(date, 'yyyy/MM/dd', { locale: ja }) : '日付を選択'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(newDate: Date | undefined) => {
            if (newDate) {
              setDate(newDate);
              setIsDateOpen(false);
            }
          }}
          locale={ja}
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold">取引入力</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">種類</label>
          <div className="flex space-x-2">
            {['income', 'expense'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t as TransactionType)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                  type === t
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t === 'income' ? '収入' : '支出'}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="取引のタイトル"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">金額</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">カテゴリ</label>
          <div className="grid min-h-[120px] grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 content-start">
            {Object.entries(categoryIds[type]).map(([name, id]) => (
              <button
                key={name}
                type="button"
                onClick={() => handleCategoryClick(id.toString(), name)}
                className={`h-10 rounded-md px-3 py-2 text-sm font-medium ${
                  category && category.id === id.toString()
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">日付</label>
          <div className="w-full">{renderDateSelector()}</div>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          保存
        </button>
      </form>
    </div>
  );
}
