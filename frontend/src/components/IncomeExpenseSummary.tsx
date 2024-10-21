'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFinancial } from './FinancialContext';
import { FaCalendarAlt } from 'react-icons/fa';

type SummaryItemProps = {
  title: string;
  amount: string;
};

const SummaryItem = ({ title, amount }: SummaryItemProps) => (
  <div className="flex justify-between">
    <h4 className="text-sm text-gray-600">{title}</h4>
    <p className="font-semibold text-right">{amount}</p>
  </div>
);

const SummarySection = ({ category, items, total, color }: { category: string; items: SummaryItemProps[]; total: string; color: string }) => (
  <div className="mb-4">
    <h2 className={`text-lg font-bold mb-2 ${color}`}>{category}</h2>
    {items.map((item, index) => (
      <SummaryItem key={index} {...item} />
    ))}
    <div className={`flex justify-between font-bold mt-2 pt-2 border-t ${color}`}>
      <span>合計</span>
      <span>{total}</span>
    </div>
  </div>
);

export default function IncomeExpenseSummary() {
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState<Date>(new Date(currentYear, 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date(currentYear, 11, 31));
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const { financialData, loading, error, fetchFinancialData } = useFinancial();

  const fetchData = useCallback(() => {
    fetchFinancialData({ startDate, endDate });
  }, [fetchFinancialData, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatPeriod = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    const months = differenceInMonths(end, start);
    const years = differenceInYears(end, start);

    if (years > 0) {
      return `${years}年と${months % 12}ヶ月`;
    } else if (months > 0) {
      return `${months}ヶ月と${days % 30}日`;
    } else {
      return `${days + 1}日間`;
    }
  };

  const renderDateSelector = (
    date: Date,
    setDate: (date: Date) => void,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
  ) => (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          {format(date, 'yyyy/MM/dd', { locale: ja })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date: Date | undefined) => {
            if (date) {
              setDate(date);
              setIsOpen(false);
            }
          }}
          locale={ja}
        />
      </PopoverContent>
    </Popover>
  );

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">収支集計</h1>
        <div className="flex items-center space-x-4 mb-2">
          {renderDateSelector(startDate, setStartDate, isStartDateOpen, setIsStartDateOpen)}
          <span>〜</span>
          {renderDateSelector(endDate, setEndDate, isEndDateOpen, setIsEndDateOpen)}
        </div>
        <p className="text-sm text-gray-600">対象期間： {formatPeriod(startDate, endDate)}</p>
      </div>
      {financialData && (
        <>
          <SummarySection
            category="収入"
            items={financialData.incomeItems.map((item) => ({
              title: item.title,
              amount: `${parseInt(item.amount).toLocaleString()}円`,
            }))}
            total={`${financialData.incomeItems.reduce((sum, item) => sum + parseInt(item.amount), 0).toLocaleString()}円`}
            color="text-green-600"
          />
          <SummarySection
            category="支出"
            items={financialData.expenseItems.map((item) => ({
              title: item.title,
              amount: `${parseInt(item.amount).toLocaleString()}円`,
            }))}
            total={`${financialData.expenseItems.reduce((sum, item) => sum + parseInt(item.amount), 0).toLocaleString()}円`}
            color="text-red-600"
          />
          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <h2 className="text-lg font-bold">残高</h2>
            <p className="font-bold text-blue-600 text-xl">{parseInt(financialData.balance).toLocaleString()}円</p>
          </div>
        </>
      )}
    </div>
  );
}
