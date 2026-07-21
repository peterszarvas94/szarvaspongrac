package shared

import (
	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
	"szarvaspongrac/utils"
)

func PatchNotifications(c echo.Context) error {
	html, err := utils.RenderHTMLForRequest(c, Notifications())
	if err != nil {
		return err
	}
	return utils.SSEHub.PatchHTML(c, html, datastar.WithSelector("#notifications-popover"), datastar.WithMode(datastar.ElementPatchModeOuter))
}
