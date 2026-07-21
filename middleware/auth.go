package middleware

import (
	"net/http"
	"github.com/labstack/echo/v4"
	"szarvaspongrac/pbclient"
	"szarvaspongrac/utils"
)

type Deps struct {
	Config    utils.Config
	PBClient  *pbclient.Client
}

func Scope(deps Deps) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			scope := utils.Scope{PBClient: deps.PBClient}
			if session, err := utils.ReadSessionCookie(c.Request(), deps.Config.SessionSecret); err == nil {
				scope.Authed = true
				scope.Email = session.Email
				scope.PBClient = deps.PBClient.WithToken(session.Token)
			}
			ctx := utils.WithScope(c.Request().Context(), scope)
			c.SetRequest(c.Request().WithContext(ctx))
			c.Set("authed", scope.Authed)
			c.Set("email", scope.Email)
			return next(c)
		}
	}
}

func RequireAuth(deps Deps) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			scope := utils.GetScope(c.Request().Context())
			if !scope.Authed {
				return c.Redirect(http.StatusSeeOther, "/admin")
			}
			return next(c)
		}
	}
}
