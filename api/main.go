package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"plantlab/api/config"
	"plantlab/api/handlers"
)

func main() {
	// Load local environment variables
	_ = godotenv.Load()

	// Initialize database
	db := config.ConnectDatabase()

	// Register routes
	mux := http.NewServeMux()

	mux.HandleFunc(
		"POST /readings",
		handlers.CreateReading(db),
	)

	log.Println("Server running on port 3000")

	if err := http.ListenAndServe(":3000", mux); err != nil {
		log.Fatal(err)
	}
}
