package sse

import (
	"log/slog"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
	"szarvaspongrac/utils"
)

func Stream(c echo.Context) error {
	type sseSignals struct {
		TabID string `json:"tab_id"`
	}

	signals := sseSignals{}
	if err := datastar.ReadSignals(c.Request(), &signals); err != nil {
		slog.Warn("sse: failed to read signals", "err", err)
		return c.NoContent(http.StatusBadRequest)
	}

	if !utils.SetTabID(c, signals.TabID) {
		slog.Warn("sse: invalid tab_id in signals")
		return c.NoContent(http.StatusBadRequest)
	}

	tabID := utils.TabIDFromContext(c.Request().Context())
	sseConn := datastar.NewSSE(c.Response().Writer, c.Request())
	utils.SSEHub.AddClient(tabID, sseConn)

	defer utils.SSEHub.RemoveClient(tabID)

	<-c.Request().Context().Done()
	return nil
}
