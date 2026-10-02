package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"plantlab/api/middleware"
	"plantlab/api/models"

	"gorm.io/gorm"
)

type CreatePlantRequest struct {
	Name string `json:"name"`
}
type AddDeviceRequest struct {
	DeviceID int64 `json:"device_id"`
}

type ReadingResponse struct {
	LightLux    float32   `json:"light_lux"`
	Temperature float32   `json:"temperature"`
	Humidity    float32   `json:"humidity"`
	CreatedAt   time.Time `json:"created_at"`
}

type PlantResponse struct {
	ID            int64            `json:"id"`
	Name          string           `json:"name"`
	DeviceID      *int64           `json:"device_id"`
	LatestReading *ReadingResponse `json:"latest_reading"`
}

func CreatePlant(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middleware.UserIDKey).(int64)

		if !ok {
			http.Error(w, "User not found in context", http.StatusUnauthorized)
			return
		}

		var req CreatePlantRequest

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		if req.Name == "" {
			http.Error(w, "Plant name is required", http.StatusBadRequest)
			return
		}

		plant := models.Plant{
			UserID: userID,
			Name:   req.Name,
		}

		if err := db.WithContext(r.Context()).Create(&plant).Error; err != nil {
			http.Error(w, "Failed to create plant", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)

		json.NewEncoder(w).Encode(plant)
	}
}

func AddDeviceToPlant(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get authenticated user
		userID, ok := r.Context().Value(middleware.UserIDKey).(int64)

		if !ok {
			http.Error(w, "User not found in context", http.StatusUnauthorized)
			return
		}

		// Get plant ID from URL
		plantID := r.PathValue("plantID")

		// Read device ID from request body
		var req AddDeviceRequest

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Find the plant and make sure it belongs to this user
		var plant models.Plant

		if err := db.WithContext(r.Context()).
			Where("id = ? AND user_id = ?", plantID, userID).
			First(&plant).Error; err != nil {

			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Plant not found", http.StatusNotFound)
				return
			}

			http.Error(w, "Failed to find plant", http.StatusInternalServerError)
			return
		}

		// Make sure the device actually exists
		var device models.Device

		if err := db.WithContext(r.Context()).
			First(&device, req.DeviceID).Error; err != nil {

			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Device not found", http.StatusNotFound)
				return
			}

			http.Error(w, "Failed to find device", http.StatusInternalServerError)
			return
		}

		// Assign device to plant
		if err := db.WithContext(r.Context()).
			Model(&plant).
			Update("device_id", req.DeviceID).Error; err != nil {

			http.Error(w, "Failed to assign device", http.StatusInternalServerError)
			return
		}

		plant.DeviceID = &req.DeviceID

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(plant)
	}
}

func GetPlants(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middleware.UserIDKey).(int64)
		if !ok {
			http.Error(w, "User not found in context", http.StatusUnauthorized)
			return
		}

		var plants []models.Plant

		if err := db.WithContext(r.Context()).
			Where("user_id = ?", userID).
			Find(&plants).Error; err != nil {

			http.Error(w, "Failed to get plants", http.StatusInternalServerError)
			return
		}

		var response []PlantResponse

		for _, plant := range plants {
			plantResponse := PlantResponse{
				ID:       plant.ID,
				Name:     plant.Name,
				DeviceID: plant.DeviceID,
			}

			if plant.DeviceID != nil {
				var reading models.Reading

				err := db.WithContext(r.Context()).
					Where("device_id = ?", *plant.DeviceID).
					Order("created_at DESC").
					First(&reading).Error

				if err == nil {
					plantResponse.LatestReading = &ReadingResponse{
						LightLux:    reading.LightLux,
						Temperature: reading.Temperature,
						Humidity:    reading.Humidity,
						CreatedAt:   reading.CreatedAt,
					}
				}
			}

			// Append AFTER we've added the reading
			response = append(response, plantResponse)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
