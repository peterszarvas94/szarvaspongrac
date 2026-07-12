package sse

import (
	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
)

func Stream(c echo.Context) error {
	sse := datastar.NewSSE(c.Response().Writer, c.Request())
	_ = sse.MarshalAndPatchSignals(map[string]any{})
	return nil
}
