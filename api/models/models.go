package models

import "time"

type User struct {
	ID           int64  `gorm:"primaryKey;autoIncrement"`
	Email        string `gorm:"not null;uniqueIndex"`
	PasswordHash string `gorm:"not null"`
}

type Plant struct {
	ID       int64  `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID   int64  `json:"user_id" gorm:"not null;index"`
	Name     string `json:"name" gorm:"not null"`
	DeviceID *int64 `json:"device_id" gorm:"index"`
}

type Device struct {
	ID   int64  `gorm:"primaryKey;autoIncrement"`
	Name string `gorm:"not null"`
}

type Reading struct {
	ID          int64     `gorm:"primaryKey;autoIncrement"`
	DeviceID    int64     `gorm:"not null;index"`
	Device      Device    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	LightLux    float32   `gorm:"not null"`
	Temperature float32   `gorm:"not null"`
	Humidity    float32   `gorm:"not null"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
}
