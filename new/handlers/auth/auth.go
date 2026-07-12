package auth

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"szarvaspongrac/pbclient"
	"szarvaspongrac/templates/pages"
	"szarvaspongrac/utils"
	view "szarvaspongrac/views/pages"
)

type Handler struct {
	Config   utils.Config
	PBClient *pbclient.Client
}

type loginForm struct {
	Email    string `form:"email"`
	Password string `form:"password"`
}

func (h *Handler) AdminPage(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	data := view.AdminData{PageData: view.PageData{
		Title:       "Admin - Szarvas Pongrác",
		Description: "Adminisztrációs terület",
		Authed:      scope.Authed,
		Email:       scope.Email,
		Canonical:   h.Config.PublicURL + "/admin",
	}}
	return utils.RenderPage(c, pages.Admin(data))
}

func (h *Handler) Login(c echo.Context) error {
	var form loginForm
	if err := c.Bind(&form); err != nil {
		return c.String(http.StatusBadRequest, "invalid form")
	}
	token, record, err := h.PBClient.AuthWithPassword(form.Email, form.Password)
	if err != nil {
		return c.Redirect(http.StatusSeeOther, "/admin?error=1")
	}
	email := pbclient.RecordString(record, "email")
	if email == "" {
		email = form.Email
	}
	session := utils.SessionData{
		Token:     token,
		Email:     email,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}
	if err := utils.SetSessionCookie(c.Response().Writer, h.Config.SessionSecret, session); err != nil {
		return err
	}
	return c.Redirect(http.StatusSeeOther, "/admin")
}

func (h *Handler) Logout(c echo.Context) error {
	utils.ClearSessionCookie(c.Response().Writer)
	return c.Redirect(http.StatusSeeOther, "/admin")
}
