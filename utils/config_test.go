package utils

import (
	"os"
	"strings"
	"testing"
)

func TestConfigValidation(t *testing.T) {
	tests := []struct {
		name      string
		change    func(*Config)
		wantError bool
	}{
		{"development defaults", func(c *Config) {}, false},
		{"invalid environment", func(c *Config) { c.AppEnv = "staging" }, true},
		{"invalid port", func(c *Config) { c.Port = "nope" }, true},
		{"port out of range", func(c *Config) { c.Port = "65536" }, true},
		{"invalid PocketBase URL", func(c *Config) { c.PBURL = "localhost" }, true},
		{"invalid public URL", func(c *Config) { c.PublicURL = "javascript:alert(1)" }, true},
		{"production missing config", func(c *Config) { c.AppEnv = "production" }, true},
		{"production missing secret", func(c *Config) { c.AppEnv = "production"; c.PublicURL = "https://example.com" }, true},
		{"production development secret", func(c *Config) {
			c.AppEnv = "production"
			c.PublicURL = "https://example.com"
			c.SessionSecret = developmentSessionSecret
		}, true},
		{"valid production", func(c *Config) {
			c.AppEnv = "production"
			c.PublicURL = "https://example.com"
			c.SessionSecret = strings.Repeat("x", 32)
		}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cfg := Config{AppEnv: "development", Port: "4321", PBURL: "http://127.0.0.1:8090"}
			tt.change(&cfg)
			if err := cfg.validate(); (err != nil) != tt.wantError {
				t.Fatalf("validate() = %v, want error %v", err, tt.wantError)
			}
		})
	}
}

func TestLoadConfigDotenvPrecedence(t *testing.T) {
	t.Chdir(t.TempDir())
	// Setenv restores all variables that godotenv may change after this test.
	for _, key := range []string{"APP_ENV", "PORT", "PB_URL", "PUBLIC_URL", "SESSION_SECRET"} {
		t.Setenv(key, "")
		if err := os.Unsetenv(key); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.WriteFile(".env.development", []byte("APP_ENV=development\nPORT=4444\nPB_URL=http://localhost:8090\n"), 0600); err != nil {
		t.Fatal(err)
	}
	t.Setenv("PORT", "5555")
	cfg, err := LoadConfig()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Port != "5555" || cfg.PublicURL != "http://localhost:5555" || cfg.PBURL != "http://localhost:8090" || cfg.SessionSecret != developmentSessionSecret {
		t.Fatal("dotenv values or environment precedence incorrect")
	}
}

func TestLoadConfigWithoutDotenv(t *testing.T) {
	t.Chdir(t.TempDir())
	t.Setenv("APP_ENV", "development")
	t.Setenv("PORT", "4321")
	t.Setenv("PB_URL", "http://localhost:8090")
	t.Setenv("PUBLIC_URL", "http://localhost:4321")
	t.Setenv("SESSION_SECRET", "")
	if _, err := LoadConfig(); err != nil {
		t.Fatal(err)
	}
}
