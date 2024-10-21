package graph

import (
	"time"

	"github.com/ZONO33LHD/kakeibo-app/database"
	"github.com/ZONO33LHD/kakeibo-app/graph/model"
)



func (r *queryResolver) getIncomeItems(startDate string, endDate string) ([]*model.IncomeExpenseItem, error) {
	// 収入項目を取得するロジック
	start, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, err
	}
	end, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, err
	}

	// データベースから指定期間の収入項目を取得
    incomes, err := database.GetIncomeItems(start, end)
    if err != nil {
        return nil, err
    }

    var items []*model.IncomeExpenseItem
    for _, income := range incomes {
        items = append(items, &model.IncomeExpenseItem{
            Title:  income.Title,
            Amount: income.Amount,
        })
    }

    return items, nil
}

func (r *queryResolver) getExpenseItems(startDate string, endDate string) ([]*model.IncomeExpenseItem, error) {
	// 支出項目を取得するロジック
	start, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, err
	}
	end, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, err
	}

	expenses, err := database.GetExpenseItems(start, end)
	if err != nil {
		return nil, err
	}

	var items []*model.IncomeExpenseItem
	for _, expense := range expenses {
		items = append(items, &model.IncomeExpenseItem{
			Title:  expense.Title,
			Amount: expense.Amount,
		})
	}

	return items, nil
}
func calculateBalance(incomeItems []*model.IncomeExpenseItem, expenseItems []*model.IncomeExpenseItem) float64 {
	var totalIncome, totalExpense float64
	for _, item := range incomeItems {
		totalIncome += item.Amount
	}
	for _, item := range expenseItems {
		totalExpense += item.Amount
	}

	return totalIncome - totalExpense
}
