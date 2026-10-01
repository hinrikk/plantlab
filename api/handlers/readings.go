package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"plantlab/api/models"

	"gorm.io/gorm"
)

type ReadingRequest struct {
	DeviceID    int64   `json:"device_id"`
	LightLux    float32 `json:"light_lux"`
	Temperature float32 `json:"temperature"`
	Humidity    float32 `json:"humidity"`
}

func CreateReading(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var reading ReadingRequest

		if err := json.NewDecoder(r.Body).Decode(&reading); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Validate the request
		if reading.DeviceID <= 0 {
			http.Error(w, "Invalid device_id", http.StatusBadRequest)
			return
		}

		// Create the database record
		record := models.Reading{
			DeviceID:    reading.DeviceID,
			LightLux:    reading.LightLux,
			Temperature: reading.Temperature,
			Humidity:    reading.Humidity,
		}

		// Save it to PostgreSQL
		if err := db.WithContext(r.Context()).Create(&record).Error; err != nil {
			http.Error(w, "Failed to save reading", http.StatusInternalServerError)
			return
		}

		fmt.Printf(
			"Saved reading: device=%d light=%.2f lux temp=%.2f C humidity=%.2f%%\n",
			reading.DeviceID,
			reading.LightLux,
			reading.Temperature,
			reading.Humidity,
		)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Reading saved",
		})
	}
}
