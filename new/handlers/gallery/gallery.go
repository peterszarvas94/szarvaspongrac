package gallery

import (
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/starfederation/datastar-go/datastar"
	"szarvaspongrac/data/image"
	"szarvaspongrac/templates/shared"
	"szarvaspongrac/utils"
	view "szarvaspongrac/views/pages"
)

type Handler struct{}

func (h *Handler) Upload(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}
	key := c.Param("key")
	if key == "" {
		key = c.FormValue("key")
	}
	if tabID := c.FormValue("tab_id"); tabID != "" {
		utils.SetTabID(c, tabID)
	}
	form, err := c.MultipartForm()
	if err != nil {
		return err
	}
	files := form.File["files"]
	for _, fh := range files {
		src, err := fh.Open()
		if err != nil {
			continue
		}
		data, _ := io.ReadAll(src)
		src.Close()
		_, _ = image.Upload(c.Request().Context(), scope.PBClient, key, fh.Filename, data)
	}
	utils.Notify(c, "Képek feltöltve")
	return h.refresh(c, key)
}

func (h *Handler) Delete(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}
	id := c.Param("id")
	key := c.QueryParam("key")
	if err := image.Delete(c.Request().Context(), scope.PBClient, id); err != nil {
		utils.NotifyError(c, "A kép törlése sikertelen")
		return err
	}
	utils.Notify(c, "Kép törölve")
	return h.refresh(c, key)
}

func (h *Handler) SetCover(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}
	id := c.Param("id")
	key := c.QueryParam("key")
	if err := image.SetCover(c.Request().Context(), scope.PBClient, id, key); err != nil {
		utils.NotifyError(c, "A borítókép beállítása sikertelen")
		return err
	}
	utils.Notify(c, "Borítókép beállítva")
	return h.refresh(c, key)
}

func (h *Handler) MoveUp(c echo.Context) error {
	return h.move(c, -1)
}

func (h *Handler) MoveDown(c echo.Context) error {
	return h.move(c, 1)
}

func (h *Handler) move(c echo.Context, dir int) error {
	scope := utils.GetScope(c.Request().Context())
	if !scope.Authed {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}
	id := c.Param("id")
	key := c.QueryParam("key")
	images, err := image.ListByKey(c.Request().Context(), scope.PBClient, key)
	if err != nil {
		return err
	}
	idx := -1
	for i, img := range images {
		if img.ID == id {
			idx = i
			break
		}
	}
	if idx < 0 {
		return c.NoContent(http.StatusBadRequest)
	}
	other := idx + dir
	if other < 0 || other >= len(images) {
		return h.refresh(c, key)
	}
	if err := image.SwapOrder(c.Request().Context(), scope.PBClient, images[idx].ID, images[other].ID); err != nil {
		utils.NotifyError(c, "A sorrend módosítása sikertelen")
		return err
	}
	utils.Notify(c, "Sorrend módosítva")
	return h.refresh(c, key)
}

func (h *Handler) refresh(c echo.Context, key string) error {
	scope := utils.GetScope(c.Request().Context())
	images, err := image.ListByKey(c.Request().Context(), scope.PBClient, key)
	if err != nil {
		return err
	}
	views := make([]view.GalleryImage, 0, len(images))
	for _, img := range images {
		views = append(views, view.GalleryImage{ID: img.ID, URL: img.URL, Cover: img.Cover, Sorting: img.Sorting})
	}
	html, err := utils.RenderString(c.Request().Context(), shared.GalleryGrid(key, views, scope.Authed))
	if err != nil {
		return err
	}
	sse := datastar.NewSSE(c.Response().Writer, c.Request())
	_ = sse.PatchElements(html, datastar.WithSelector("#gallery-grid"), datastar.WithMode(datastar.ElementPatchModeOuter))
	_ = shared.PatchNotifications(c, sse)
	return c.NoContent(http.StatusNoContent)
}
