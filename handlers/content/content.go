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
	TabID      string `json:"tab_id"`
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
	if !utils.SetTabID(c, signals.TabID) {
		return c.NoContent(http.StatusBadRequest)
	}

	sanitized := utils.SanitizeHTML(signals.EditorHTML)
	if err := content.Save(c.Request().Context(), scope.PBClient, key, sanitized); err != nil {
		utils.NotifyError(c, "A mentés sikertelen")
		return err
	}
	utils.Notify(c, "Tartalom mentve")

	tabID := utils.TabIDFromContext(c.Request().Context())
	st := utils.GetPageState(tabID)
	st.EditingKey = ""
	st.EditorHTML = ""
	utils.SetPageState(tabID, st)

	regionHTML, err := utils.RenderHTMLForRequest(c, shared.ProseEditRegion(shared.ProseEditData{
		ContentKey:  key,
		ContentHTML: sanitized,
		EditingKey:  "",
		EditorHTML:  "",
		Authed:      true,
	}))
	if err != nil {
		return err
	}
	if err := utils.SSEHub.PatchHTML(c, regionHTML, datastar.WithSelector("#prose-edit-region"), datastar.WithMode(datastar.ElementPatchModeOuter)); err != nil {
		return err
	}
	if err := utils.SSEHub.ExecuteScript(c, "window.destroyEditor()"); err != nil {
		return err
	}
	if err := utils.SSEHub.PatchSignals(c, utils.PageSignals(st, tabID)); err != nil {
		return err
	}
	if err := shared.PatchNotifications(c); err != nil {
		return err
	}
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
