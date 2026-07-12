package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
	"net/http"
	"strings"
	"time"
)

const sessionCookieName = "sp_session"

type SessionData struct {
	Token     string
	Email     string
	ExpiresAt time.Time
}

func EncryptSession(secret string, data SessionData) (string, error) {
	plaintext := data.Token + "|" + data.Email + "|" + data.ExpiresAt.Format(time.RFC3339)
	key := deriveKey(secret)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(gcm.Seal(nonce, nonce, []byte(plaintext), nil)), nil
}

func DecryptSession(secret, encoded string) (SessionData, error) {
	var data SessionData
	raw, err := base64.RawURLEncoding.DecodeString(encoded)
	if err != nil {
		return data, err
	}
	key := deriveKey(secret)
	block, err := aes.NewCipher(key)
	if err != nil {
		return data, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return data, err
	}
	nonceSize := gcm.NonceSize()
	if len(raw) < nonceSize {
		return data, errors.New("invalid session")
	}
	plaintext, err := gcm.Open(nil, raw[:nonceSize], raw[nonceSize:], nil)
	if err != nil {
		return data, err
	}
	parts := strings.SplitN(string(plaintext), "|", 3)
	if len(parts) != 3 {
		return data, errors.New("invalid session payload")
	}
	expiresAt, err := time.Parse(time.RFC3339, parts[2])
	if err != nil {
		return data, err
	}
	if time.Now().After(expiresAt) {
		return data, errors.New("session expired")
	}
	return SessionData{Token: parts[0], Email: parts[1], ExpiresAt: expiresAt}, nil
}

func SetSessionCookie(w http.ResponseWriter, secret string, data SessionData) error {
	encoded, err := EncryptSession(secret, data)
	if err != nil {
		return err
	}
	http.SetCookie(w, &http.Cookie{Name: sessionCookieName, Value: encoded, Path: "/", HttpOnly: true, SameSite: http.SameSiteLaxMode, MaxAge: int(time.Until(data.ExpiresAt).Seconds())})
	return nil
}

func ClearSessionCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{Name: sessionCookieName, Value: "", Path: "/", HttpOnly: true, MaxAge: -1})
}

func ReadSessionCookie(r *http.Request, secret string) (SessionData, error) {
	cookie, err := r.Cookie(sessionCookieName)
	if err != nil {
		return SessionData{}, err
	}
	return DecryptSession(secret, cookie.Value)
}

func deriveKey(secret string) []byte {
	key := make([]byte, 32)
	copy(key, []byte(secret))
	return key
}
