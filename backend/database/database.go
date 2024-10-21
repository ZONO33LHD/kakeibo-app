package database

import (
	"time"
	"database/sql"
	_ "github.com/lib/pq"
	"github.com/ZONO33LHD/kakeibo-app/graph/model"
)

var db *sql.DB

func SetDB(database *sql.DB) {
    db = database
}

func GetIncomeItems(start time.Time, end time.Time) ([]*model.IncomeExpenseItem, error) {
	rows, err := db.Query("SELECT title, amount FROM income_items WHERE date >= $1 AND date <= $2", start, end)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []*model.IncomeExpenseItem
	for rows.Next() {
		item := &model.IncomeExpenseItem{}
		if err := rows.Scan(&item.Title, &item.Amount); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

func GetExpenseItems(start time.Time, end time.Time) ([]*model.IncomeExpenseItem, error) {
	rows, err := db.Query("SELECT title, amount FROM expense_items WHERE date >= $1 AND date <= $2", start, end)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []*model.IncomeExpenseItem
	for rows.Next() {
		item := &model.IncomeExpenseItem{}
		if err := rows.Scan(&item.Title, &item.Amount); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

func CreateTransaction(title string, amount float64, typeQ string, date string, categoryID string) (string, error) {
    query := `INSERT INTO transactions (title, amount, type, date, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`
    var id string
    err := db.QueryRow(query, title, amount, typeQ, date, categoryID).Scan(&id)
    if err != nil {
        return "", err
    }
    return id, nil
}

func GetCategoryName(categoryID string) (string, error) {
    query := `SELECT name FROM categories WHERE id = $1`
    var name string
    err := db.QueryRow(query, categoryID).Scan(&name)
    if err != nil {
        return "", err
    }
	return name, nil
}
