package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"database/sql"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/ZONO33LHD/kakeibo-app/database"
	"github.com/ZONO33LHD/kakeibo-app/graph"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

const defaultPort = "8080"

var DB *sql.DB

func init() {
	var err error
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL環境変数が設定されていません")
	}

	// データベースが起動するまで待機
	for i := 0; i < 30; i++ {
		DB, err = sql.Open("postgres", dbURL)
		if err == nil {
			if err = DB.Ping(); err == nil {
				log.Println("データベース接続に成功しました")
				return
			}
		}
		log.Printf("データベース接続を待機中... (%d/30)", i+1)
		time.Sleep(time.Second)
	}

	log.Fatalf("データベース接続の初期化に失敗しました: %v", err)
}

func main() {
	// DB接続
	log.Println("データベース接続を開始します...")
	database.SetDB(DB)
	if err := DB.Ping(); err != nil {
		log.Fatalf("データベース接続に失敗しました: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// CORSミドルウェアを設定
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
		Debug:            true,
	})

	// ハンドラーをラップ
	handler := c.Handler(srv)

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", handler)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
