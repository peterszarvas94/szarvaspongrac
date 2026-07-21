package utils

import "os"

type Config struct {
	Port          string
	PBURL         string
	SessionSecret string
	PublicURL     string
}

func LoadConfig() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4321"
	}
	pbURL := os.Getenv("PB_URL")
	if pbURL == "" {
		pbURL = "http://127.0.0.1:8090"
	}
	secret := os.Getenv("SESSION_SECRET")
	if secret == "" {
		secret = "dev-secret-change-in-production"
	}
	publicURL := os.Getenv("PUBLIC_URL")
	if publicURL == "" {
		publicURL = "http://localhost:" + port
	}
	return Config{Port: port, PBURL: pbURL, SessionSecret: secret, PublicURL: publicURL}
}
