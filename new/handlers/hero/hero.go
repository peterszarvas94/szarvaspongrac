package hero

import (
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
	"szarvaspongrac/data/image"
	"szarvaspongrac/templates/pages"
	"szarvaspongrac/templates/shared"
	"szarvaspongrac/utils"
)

type Handler struct{}

func (h *Handler) Upload(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}
	key := c.Param("key")
	if tabID := c.FormValue("tab_id"); tabID != "" {
		utils.SetTabID(c, tabID)
	}
	file, err := c.FormFile("file")
	if err != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()
	data, err := io.ReadAll(src)
	if err != nil {
		return err
	}
	img, err := image.ReplaceByKey(c.Request().Context(), scope.PBClient, key, file.Filename, data)
	if err != nil {
		utils.NotifyError(c, "A borítókép feltöltése sikertelen")
		return err
	}
	utils.Notify(c, "Borítókép frissítve")

	html, err := utils.RenderHTMLForRequest(c, pages.HeroSection(img.URL))
	if err != nil {
		return err
	}
	sse := datastar.NewSSE(c.Response().Writer, c.Request())
	_ = sse.PatchElements(html, datastar.WithSelector("#hero-section"), datastar.WithMode(datastar.ElementPatchModeOuter))
	_ = shared.PatchNotifications(c, sse)
	return c.NoContent(http.StatusNoContent)
}
