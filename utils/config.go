package utils

import (
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

const developmentSessionSecret = "dev-secret-change-in-production"

type Config struct {
	AppEnv        string `env:"APP_ENV" envDefault:"development"`
	Port          string `env:"PORT" envDefault:"4321"`
	PBURL         string `env:"PB_URL" envDefault:"http://127.0.0.1:8090"`
	SessionSecret string `env:"SESSION_SECRET"`
	PublicURL     string `env:"PUBLIC_URL"`
}

// APP_ENV selects the dotenv file; shell/systemd variables take precedence.
func LoadConfig() (Config, error) {
	appEnv := os.Getenv("APP_ENV")
	if appEnv == "" {
		appEnv = "development"
	}
	if appEnv != "development" && appEnv != "production" {
		return Config{}, fmt.Errorf("APP_ENV must be development or production")
	}
	filename := ".env." + appEnv
	if err := godotenv.Load(filename); err != nil && !os.IsNotExist(err) {
		return Config{}, fmt.Errorf("load %s: %w", filename, err)
	}
	var cfg Config
	if err := env.Parse(&cfg); err != nil {
		return Config{}, fmt.Errorf("parse environment: %w", err)
	}
	if cfg.AppEnv != appEnv {
		return Config{}, fmt.Errorf("APP_ENV in %s must match the selected environment", filename)
	}
	if err := cfg.validate(); err != nil {
		return Config{}, err
	}
	return cfg, nil
}

func (cfg *Config) validate() error {
	if cfg.AppEnv != "development" && cfg.AppEnv != "production" {
		return fmt.Errorf("APP_ENV must be development or production")
	}
	port, err := strconv.Atoi(cfg.Port)
	if err != nil || port < 1 || port > 65535 {
		return fmt.Errorf("PORT must be between 1 and 65535")
	}
	if cfg.PublicURL == "" {
		if cfg.AppEnv == "production" {
			return fmt.Errorf("PUBLIC_URL is required in production")
		}
		cfg.PublicURL = "http://localhost:" + cfg.Port
	}
	for _, field := range []struct{ name, value string }{
		{"PB_URL", cfg.PBURL}, {"PUBLIC_URL", cfg.PublicURL},
	} {
		u, err := url.Parse(field.value)
		if err != nil || u.Hostname() == "" || (u.Scheme != "http" && u.Scheme != "https") || u.User != nil || u.RawQuery != "" || u.Fragment != "" {
			return fmt.Errorf("%s must be an HTTP(S) URL without credentials, query, or fragment", field.name)
		}
	}
	cfg.PBURL = strings.TrimRight(cfg.PBURL, "/")
	cfg.PublicURL = strings.TrimRight(cfg.PublicURL, "/")
	if cfg.AppEnv == "production" {
		if cfg.SessionSecret == developmentSessionSecret || len(strings.TrimSpace(cfg.SessionSecret)) < 32 {
			return fmt.Errorf("SESSION_SECRET must be a non-default secret of at least 32 characters in production")
		}
	} else if cfg.SessionSecret == "" {
		cfg.SessionSecret = developmentSessionSecret
	}
	return nil
}
