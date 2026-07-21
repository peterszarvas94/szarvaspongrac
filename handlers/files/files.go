package files

import (
	"github.com/labstack/echo/v4"
	"szarvaspongrac/pbclient"
)

type Handler struct {
	Client *pbclient.Client
}

func (h *Handler) Proxy(c echo.Context) error {
	path := c.Request().URL.Path
	h.Client.ProxyFile(c.Response().Writer, c.Request(), path)
	return nil
}
