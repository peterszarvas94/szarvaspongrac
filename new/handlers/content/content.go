package content

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
	"szarvaspongrac/data/content"
	"szarvaspongrac/data/image"
	"szarvaspongrac/templates/shared"
	"szarvaspongrac/utils"
)

type Handler struct{}

type saveSignals struct {
	EditorHTML string `json:"editorHtml"`
}

func (h *Handler) Save(c echo.Context) error {
	key := c.Param("key")
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}
	var signals saveSignals
	if err := datastar.ReadSignals(c.Request(), &signals); err != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	sanitized := utils.SanitizeHTML(signals.EditorHTML)
	if err := content.Save(c.Request().Context(), scope.PBClient, key, sanitized); err != nil {
		utils.NotifyError(c, "A mentés sikertelen")
		return err
	}
	utils.Notify(c, "Tartalom mentve")
	html, err := utils.RenderString(c.Request().Context(), shared.ContentBlock(key, sanitized, false))
	if err != nil {
		return err
	}
	sse := datastar.NewSSE(c.Response().Writer, c.Request())
	_ = sse.PatchElements(html, datastar.WithSelector("#content-"+utils.ContentKeyID(key)), datastar.WithMode(datastar.ElementPatchModeOuter))
	_ = sse.MarshalAndPatchSignals(map[string]any{"editMode": false, "editingKey": ""})
	_ = shared.PatchNotifications(c, sse)
	return c.NoContent(http.StatusNoContent)
}

func (h *Handler) UploadImage(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}
	key := c.FormValue("key")
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "missing file"})
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()
	data := make([]byte, file.Size)
	if _, err := src.Read(data); err != nil {
		return err
	}
	img, err := image.Upload(c.Request().Context(), scope.PBClient, key, file.Filename, data)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, map[string]string{"url": img.URL})
}
