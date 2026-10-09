package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"plantlab/api/config"
	"plantlab/api/handlers"
	"plantlab/api/middleware"
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

	mux.HandleFunc(
		"POST /auth/register",
		handlers.Register(db),
	)

	mux.HandleFunc(
		"POST /auth/login",
		handlers.Login(db),
	)

	mux.HandleFunc(
		"POST /plants",
		middleware.Authenticate(
			handlers.CreatePlant(db),
		),
	)

	mux.HandleFunc(
		"PUT /plants/{plantID}/device",
		middleware.Authenticate(
			handlers.AddDeviceToPlant(db),
		),
	)

	mux.HandleFunc(
		"GET /plants",
		middleware.Authenticate(
			handlers.GetPlants(db),
		),
	)

	mux.HandleFunc(
		"DELETE /plants/{plantID}",
		middleware.Authenticate(
			handlers.DeletePlant(db),
		),
	)

	log.Println("Server running on port 3000")

	if err := http.ListenAndServe(":3000", mux); err != nil {
		log.Fatal(err)
	}
}
