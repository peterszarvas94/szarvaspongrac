package shared

import (
	"fmt"
	"time"
)

const copyrightStartYear = 2025

func CopyrightNotice() string {
	year := time.Now().Year()
	return fmt.Sprintf("Szarvas Pongrác %d-%d", copyrightStartYear, year)
}
