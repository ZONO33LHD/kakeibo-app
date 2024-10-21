import { gql } from '@apollo/client';

// 取引を作成
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      title
      amount
      typeQ
      category {
        id
        name
      }
      date
    }
  }
`;

// 収支の取得
export const GET_INCOME_EXPENSE_SUMMARY = gql`
  query GetIncomeExpenseSummary($startDate: String!, $endDate: String!) {
    getIncomeExpenseSummary(startDate: $startDate, endDate: $endDate) {
      incomeItems {
        title
        amount
      }
      expenseItems {
        title
        amount
      }
      balance
    }
  }
`;
