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
