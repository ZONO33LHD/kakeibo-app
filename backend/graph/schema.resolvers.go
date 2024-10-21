package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.54

import (
	"context"

	"github.com/ZONO33LHD/kakeibo-app/database"
	"github.com/ZONO33LHD/kakeibo-app/graph/model"
)

// CreateTransaction is the resolver for the createTransaction field.
func (r *mutationResolver) CreateTransaction(ctx context.Context, input model.CreateTransactionInput) (*model.Transaction, error) {
	// データベースに取引を登録するロジック
	id, err := database.CreateTransaction(input.Title, input.Amount, input.TypeQ, input.Date, input.CategoryID)
	if err != nil {
		return nil, err
	}

	categoryName, err := database.GetCategoryName(input.CategoryID)
	if err != nil {
		return nil, err
	}

	// 取引を作成するロジック
	transaction := &model.Transaction{
		ID:     id,
		Title:  input.Title,
		Amount: input.Amount,
		TypeQ:  input.TypeQ,
		Category: &model.Category{
			ID:   input.CategoryID,
			Name: categoryName,
		},
		Date: input.Date,
	}

	return transaction, nil
}

// GetIncomeExpenseSummary is the resolver for the getIncomeExpenseSummary field.
func (r *queryResolver) GetIncomeExpenseSummary(ctx context.Context, startDate string, endDate string) (*model.IncomeExpenseSummary, error) {
	// 収支の取得ロジック

	// 収入項目を取得
	incomeItems, err := r.getIncomeItems(startDate, endDate)
	if err != nil {
		return nil, err
	}

	// 支出項目を取得
	expenseItems, err := r.getExpenseItems(startDate, endDate)
	if err != nil {
		return nil, err
	}

	// 収支を計算
	balance := calculateBalance(incomeItems, expenseItems)

	summary := &model.IncomeExpenseSummary{
		IncomeItems:  incomeItems,
		ExpenseItems: expenseItems,
		Balance:      balance,
	}

	return summary, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }