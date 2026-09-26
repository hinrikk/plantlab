package models

import "time"

type User struct {
	ID           int64  `gorm:"primaryKey;autoIncrement"`
	Email        string `gorm:"not null;uniqueIndex"`
	PasswordHash string `gorm:"not null"`
}

type Plant struct {
	ID     int64  `gorm:"primaryKey;autoIncrement"`
	UserID int64  `gorm:"not null"`
	Name   string `gorm:"not null"`
}

type Reading struct {
	ID        int64     `gorm:"primaryKey;autoIncrement"`
	PlantID   int64     `gorm:"not null"`
	LightLux  float32   `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
