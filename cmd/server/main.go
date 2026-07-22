package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"szarvaspongrac/handlers/auth"
	contenthdl "szarvaspongrac/handlers/content"
	"szarvaspongrac/handlers/files"
	fraghdl "szarvaspongrac/handlers/fragments"
	galleryhdl "szarvaspongrac/handlers/gallery"
	herohdl "szarvaspongrac/handlers/hero"
	"szarvaspongrac/assets"
	"szarvaspongrac/handlers/pages"
	"szarvaspongrac/handlers/sse"
	statehdl "szarvaspongrac/handlers/state"
	authmw "szarvaspongrac/middleware"
	"szarvaspongrac/pbclient"
	"szarvaspongrac/utils"
)

func main() {
	cfg := utils.LoadConfig()

	e := echo.New()
	e.HideBanner = true
	e.HidePort = true
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())
	e.Use(middleware.Logger())

	pb := pbclient.New(cfg.PBURL)
	deps := authmw.Deps{Config: cfg, PBClient: pb}
	e.Use(authmw.Scope(deps))

	assets.Init(os.DirFS("static"))
	e.Static("/static", "static")
	e.Static("/fonts", "public/fonts")
	e.File("/favicon.ico", "public/favicon.ico")

	fileH := &files.Handler{Client: pb}
	e.GET("/api/files/*", fileH.Proxy)

	pageH := &pages.Handler{Config: cfg}
	authH := &auth.Handler{Config: cfg, PBClient: pb}
	contentH := &contenthdl.Handler{}
	galleryH := &galleryhdl.Handler{}
	heroH := &herohdl.Handler{}
	stateH := &statehdl.Handler{}

	e.GET("/health", func(c echo.Context) error { return c.String(http.StatusOK, "ok") })
	e.GET("/sse", sse.Stream)
	e.GET("/fragments/notifications", fraghdl.Notifications)

	e.GET("/", pageH.Home)
	e.GET("/oneletrajz", pageH.Oneletrajz)
	e.GET("/elismeresek", pageH.Elismeresek)
	e.GET("/konyvillusztraciok", pageH.Konyvillusztraciok)
	e.GET("/kapcsolat", pageH.Contact)
	e.GET("/galeria", pageH.GalleryIndex)
	e.GET("/galeria/:slug", pageH.Gallery)
	e.GET("/admin", authH.AdminPage)
	e.POST("/auth/login", authH.Login)
	e.POST("/auth/logout", authH.Logout)

	mutate := e.Group("", authmw.RequireAuth(deps))
	mutate.PATCH("/state/edit", stateH.PatchEdit)
	mutate.PATCH("/state/content", stateH.PatchContent)
	mutate.PATCH("/content/:key", contentH.Save)
	mutate.POST("/content-images", contentH.UploadImage)
	mutate.POST("/gallery/:key/upload", galleryH.Upload)
	mutate.POST("/hero/:key/upload", heroH.Upload)
	mutate.POST("/gallery/images/:id/cover", galleryH.SetCover)
	mutate.POST("/gallery/images/:id/up", galleryH.MoveUp)
	mutate.POST("/gallery/images/:id/down", galleryH.MoveDown)
	mutate.POST("/gallery/images/:id/delete", galleryH.Delete)

	fmt.Println("server is running on " + cfg.PublicURL)
	if err := e.Start(":" + cfg.Port); err != nil && err != http.ErrServerClosed {
		slog.Error("server failed", "err", err)
		os.Exit(1)
	}
}
