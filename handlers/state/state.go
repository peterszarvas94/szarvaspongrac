package state

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
	"szarvaspongrac/data/content"
	"szarvaspongrac/data/image"
	"szarvaspongrac/templates/pages"
	"szarvaspongrac/templates/shared"
	"szarvaspongrac/utils"
	view "szarvaspongrac/views/pages"
)

type Handler struct{}

type stateSignals struct {
	TabID      string `json:"tab_id"`
	Action     string `json:"action"`
	ContentKey string `json:"contentKey"`
	GalleryKey string `json:"galleryKey"`
}

func (h *Handler) PatchEdit(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	var signals stateSignals
	if err := datastar.ReadSignals(c.Request(), &signals); err != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	if !utils.SetTabID(c, signals.TabID) {
		return c.NoContent(http.StatusBadRequest)
	}

	tabID := utils.TabIDFromContext(c.Request().Context())
	st := utils.GetPageState(tabID)

	switch strings.TrimSpace(signals.Action) {
	case "enter":
		st.EditMode = true
	case "exit":
		st.EditMode = false
	default:
		return c.NoContent(http.StatusBadRequest)
	}
	utils.SetPageState(tabID, st)

	switch strings.TrimSpace(signals.ContentKey) {
	case "home.home":
		hero, err := image.GetFirst(c.Request().Context(), scope.PBClient, "home.home")
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		html, err := utils.RenderHTMLForRequest(c, pages.HomeAdmin(view.HomeAdminData{
			ContentKey:   "home.home",
			Authed:       true,
			EditMode:     st.EditMode,
			HeroURL:      hero.URL,
			HeroFilename: hero.Filename,
		}))
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		if err := utils.SSEHub.PatchHTML(c, html, datastar.WithSelector("#home-admin"), datastar.WithMode(datastar.ElementPatchModeOuter)); err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
	case "":
		if signals.GalleryKey == "" {
			return c.NoContent(http.StatusBadRequest)
		}
		images, err := image.ListByKey(c.Request().Context(), scope.PBClient, signals.GalleryKey)
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		views := make([]view.GalleryImage, 0, len(images))
		for _, img := range images {
			views = append(views, view.GalleryImage{ID: img.ID, URL: img.URL, Cover: img.Cover, Sorting: img.Sorting})
		}
		adminHTML, err := utils.RenderHTMLForRequest(c, pages.GalleryAdmin(view.GalleryAdminData{
			Key:      signals.GalleryKey,
			Authed:   true,
			EditMode: st.EditMode,
		}))
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		if err := utils.SSEHub.PatchHTML(c, adminHTML, datastar.WithSelector("#gallery-admin"), datastar.WithMode(datastar.ElementPatchModeOuter)); err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		gridHTML, err := utils.RenderHTMLForRequest(c, shared.GalleryGrid(signals.GalleryKey, views, true, st.EditMode))
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		if err := utils.SSEHub.PatchHTML(c, gridHTML, datastar.WithSelector("#gallery-grid"), datastar.WithMode(datastar.ElementPatchModeOuter)); err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
	default:
		return c.NoContent(http.StatusBadRequest)
	}

	if err := utils.SSEHub.PatchSignals(c, utils.PageSignals(st, tabID)); err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.NoContent(http.StatusOK)
}

func (h *Handler) PatchContent(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	var signals stateSignals
	if err := datastar.ReadSignals(c.Request(), &signals); err != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	if !utils.SetTabID(c, signals.TabID) {
		return c.NoContent(http.StatusBadRequest)
	}

	key := strings.TrimSpace(signals.ContentKey)
	if key == "" {
		return c.NoContent(http.StatusBadRequest)
	}

	tabID := utils.TabIDFromContext(c.Request().Context())
	st := utils.GetPageState(tabID)

	switch strings.TrimSpace(signals.Action) {
	case "edit":
		html, err := content.GetByKey(c.Request().Context(), scope.PBClient, key)
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		st.EditingKey = key
		st.EditorHTML = html
	case "cancel":
		st.EditingKey = ""
		st.EditorHTML = ""
	default:
		return c.NoContent(http.StatusBadRequest)
	}
	utils.SetPageState(tabID, st)

	contentHTML, _ := content.GetByKey(c.Request().Context(), scope.PBClient, key)
	regionHTML, err := utils.RenderHTMLForRequest(c, shared.ProseEditRegion(shared.ProseEditData{
		ContentKey:  key,
		ContentHTML: contentHTML,
		EditingKey:  st.EditingKey,
		EditorHTML:  st.EditorHTML,
		Authed:      true,
	}))
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	if err := utils.SSEHub.PatchHTML(c, regionHTML, datastar.WithSelector("#prose-edit-region"), datastar.WithMode(datastar.ElementPatchModeOuter)); err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	if st.EditingKey == "" {
		if err := utils.SSEHub.ExecuteScript(c, "window.destroyEditor()"); err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
	} else if err := utils.SSEHub.ExecuteScript(c, "window.bootEditor()"); err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	if err := utils.SSEHub.PatchSignals(c, utils.PageSignals(st, tabID)); err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.NoContent(http.StatusOK)
}
