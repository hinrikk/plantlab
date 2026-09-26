package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"plantlab/api/models"

	"gorm.io/gorm"
)

type ReadingRequest struct {
	PlantID  int64   `json:"plant_id"`
	LightLux float32 `json:"light_lux"`
}

func CreateReading(db *gorm.DB) http.HandlerFunc {
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
