'use client';
import React from 'react';
import IncomeExpenseSummary from '../../../components/IncomeExpenseSummary';
import TransactionForm from '../../../components/TransactionForm';
import FinancialAnalysis from '../../../components/FinancialAnalysis';

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <IncomeExpenseSummary />
        <TransactionForm />
      </div>
      <FinancialAnalysis />
    </div>
  );
}
