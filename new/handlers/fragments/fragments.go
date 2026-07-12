package fragments

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"szarvaspongrac/templates/shared"
	"szarvaspongrac/utils"
)

func Notifications(c echo.Context) error {
	if tabID := c.QueryParam("tab_id"); tabID != "" {
		utils.SetTabID(c, tabID)
	}
	html, err := utils.RenderHTMLForRequest(c, shared.Notifications())
	if err != nil {
		return err
	}
	return c.HTML(http.StatusOK, html)
}
