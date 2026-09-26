package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"plantlab/api/models"
)

type ReadingRequest struct {
	PlantID  int64   `json:"plant_id"`
	LightLux float32 `json:"light_lux"`
}

func readingsHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var reading ReadingRequest

		if err := json.NewDecoder(r.Body).Decode(&reading); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Validate the request
		if reading.PlantID <= 0 {
			http.Error(w, "Invalid plant_id", http.StatusBadRequest)
			return
		}

		// Create the database record
		record := models.Reading{
			PlantID:  reading.PlantID,
			LightLux: reading.LightLux,
		}

		// Save it to PostgreSQL
		if err := db.WithContext(r.Context()).Create(&record).Error; err != nil {
			http.Error(w, "Failed to save reading", http.StatusInternalServerError)
			return
		}

		// Only respond with success after saving
		fmt.Printf("Saved light reading: %f\n", reading.LightLux)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Reading saved",
		})
	}
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		panic("DATABASE_URL is not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.Plant{},
		&models.Reading{},
	); err != nil {
		panic(err)
	}

	fmt.Println("Connected to PostgreSQL with GORM!")
	http.HandleFunc("/readings", readingsHandler(db))
	fmt.Println("Server running on port 3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		panic(err)
	}
}
