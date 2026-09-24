package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/jackc/pgx/v5"
)

type Reading struct {
	Light int `json:"light"`
}

func readingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var reading Reading

	err := json.NewDecoder(r.Body).Decode(&reading)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	fmt.Printf("Received light reading: %d\n", reading.Light)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Reading received",
	})
}

func main() {
    conn, err := pgx.Connect(
        context.Background(),
        "postgres://plantlab:plantlab@localhost:5433/plantlab",
    )
    if err != nil {
        panic(err)
    }
    defer conn.Close(context.Background())

    if err := conn.Ping(context.Background()); err != nil {
        panic(err)
    }

    fmt.Println("Connected to PostgreSQL!")

	http.HandleFunc("/readings", readingsHandler)

	fmt.Println("Server running on port 3000")

	err = http.ListenAndServe(":3000", nil)
}