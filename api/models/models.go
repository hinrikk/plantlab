package models

import "time"

type User struct {
	ID           int64  `gorm:"primaryKey;autoIncrement"`
	Email        string `gorm:"not null;uniqueIndex"`
	PasswordHash string `gorm:"not null"`
}

type Plant struct {
	ID       int64  `gorm:"primaryKey;autoIncrement"`
	UserID   int64  `gorm:"not null;index"`
	Name     string `gorm:"not null"`
	DeviceID *int64 `gorm:"uniqueIndex"`
}

type Device struct {
	ID   int64  `gorm:"primaryKey;autoIncrement"`
	Name string `gorm:"not null"`
}

type Reading struct {
	ID          int64     `gorm:"primaryKey;autoIncrement"`
	DeviceID    int64     `gorm:"not null;index"`
	LightLux    float32   `gorm:"not null"`
	Temperature float32   `gorm:"not null"`
	Humidity    float32   `gorm:"not null"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
}
