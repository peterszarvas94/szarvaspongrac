package shared

import (
	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
	"szarvaspongrac/utils"
)

func PatchNotifications(c echo.Context, sse *datastar.ServerSentEventGenerator) error {
	html, err := utils.RenderHTMLForRequest(c, Notifications())
	if err != nil {
		return err
	}
	return sse.PatchElements(html, datastar.WithSelector("#notifications-popover"), datastar.WithMode(datastar.ElementPatchModeOuter))
}
