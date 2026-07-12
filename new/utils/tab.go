package utils

import (
	"context"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
)

type tabIDContextKey string

const tabIDKey tabIDContextKey = "tab_id"

func WithTabID(ctx context.Context, tabID string) context.Context {
	return context.WithValue(ctx, tabIDKey, tabID)
}

func TabIDFromContext(ctx context.Context) string {
	if id, ok := ctx.Value(tabIDKey).(string); ok {
		return id
	}
	return ""
}

func EnsureTabIDFromContext(ctx context.Context) string {
	if tabID := TabIDFromContext(ctx); tabID != "" {
		return tabID
	}
	return GenerateID("tab")
}

func SetTabID(c echo.Context, tabID string) bool {
	tabID = strings.TrimSpace(tabID)
	if tabID == "" {
		return false
	}
	c.SetRequest(c.Request().WithContext(WithTabID(c.Request().Context(), tabID)))
	return true
}

func EnsureTabID(c echo.Context) string {
	if tabID := TabIDFromContext(c.Request().Context()); tabID != "" {
		return tabID
	}

	type tabSignals struct {
		TabID string `json:"tab_id"`
	}
	signals := tabSignals{}
	if err := datastar.ReadSignals(c.Request(), &signals); err == nil {
		if SetTabID(c, signals.TabID) {
			return signals.TabID
		}
	}

	tabID := GenerateID("tab")
	c.SetRequest(c.Request().WithContext(WithTabID(c.Request().Context(), tabID)))
	return tabID
}
