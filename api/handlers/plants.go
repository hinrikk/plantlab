package handlers

import (
	"encoding/json"
	"net/http"

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
