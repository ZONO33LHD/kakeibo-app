FROM golang:1.23.2-alpine3.19

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

RUN go install github.com/99designs/gqlgen@latest

COPY . .

RUN go generate ./...

RUN go build -o main ./server.go

CMD ["./main"]
