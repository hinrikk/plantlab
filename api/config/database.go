package config

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"plantlab/api/models"
)

func ConnectDatabase() *gorm.DB {
	// Read database connection string
	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		panic("DATABASE_URL is not set")
	}

	// Connect to PostgreSQL
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	// Automatically create or update database tables
	if err := db.AutoMigrate(
		&models.User{},
		&models.Plant{},
		&models.Reading{},
	); err != nil {
		panic(err)
	}

	fmt.Println("Connected to PostgreSQL with GORM!")

	return db
}
