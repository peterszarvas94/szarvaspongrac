package utils

import (
	"crypto/rand"
	"strings"
)

const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func GenerateID(prefix string) string {
	if len(prefix) != 3 {
		panic("ID prefix must be exactly 3 characters")
	}
	prefix = strings.ToLower(prefix)

	b := make([]byte, 20)
	if _, err := rand.Read(b); err != nil {
		panic("failed to generate random bytes: " + err.Error())
	}
	for i := range b {
		b[i] = alphanumeric[int(b[i])%len(alphanumeric)]
	}
	return prefix + "_" + string(b)
}
