'use client';

import { useApolloClient, useQuery } from '@apollo/client';
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { GET_INCOME_EXPENSE_SUMMARY } from './gqls/query';

type SummaryItemProps = {
  title: string;
  amount: string;
};

type FinancialData = {
  incomeItems: SummaryItemProps[];
  expenseItems: SummaryItemProps[];
  balance: string;
};

type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface FinancialContextType {
  financialData: FinancialData | null;
  loading: boolean;
  error: Error | null;
  fetchFinancialData: (range: DateRange) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

type FinancialProviderProps = {
  children: ReactNode;
};

export const FinancialProvider: React.FC<FinancialProviderProps> = ({ children }) => {
  const client = useApolloClient();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFinancialData = useCallback(async ({ startDate, endDate }: DateRange) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.query({
        query: GET_INCOME_EXPENSE_SUMMARY,
        variables: { 
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        },
      });
      setFinancialData(data.getIncomeExpenseSummary);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [client]);

  return (
    <FinancialContext.Provider
      value={{
        financialData,
        loading,
        error,
        fetchFinancialData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
