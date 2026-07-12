package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"szarvaspongrac/handlers/auth"
	contenthdl "szarvaspongrac/handlers/content"
	"szarvaspongrac/handlers/files"
	fraghdl "szarvaspongrac/handlers/fragments"
	galleryhdl "szarvaspongrac/handlers/gallery"
	herohdl "szarvaspongrac/handlers/hero"
	"szarvaspongrac/handlers/pages"
	"szarvaspongrac/handlers/sse"
	authmw "szarvaspongrac/middleware"
	"szarvaspongrac/pbclient"
	"szarvaspongrac/utils"
)

func main() {
	_ = godotenv.Load()
	cfg := utils.LoadConfig()

	e := echo.New()
	e.HideBanner = true
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())
	e.Use(middleware.Logger())

	pb := pbclient.New(cfg.PBURL)
	deps := authmw.Deps{Config: cfg, PBClient: pb}
	e.Use(authmw.Scope(deps))

	e.Static("/static", "static")
	e.Static("/fonts", "public/fonts")
	e.Static("/images", "public/images")
	e.File("/favicon.ico", "public/favicon.ico")

	fileH := &files.Handler{Client: pb}
	e.GET("/api/files/*", fileH.Proxy)

	pageH := &pages.Handler{Config: cfg}
	authH := &auth.Handler{Config: cfg, PBClient: pb}
	contentH := &contenthdl.Handler{}
	galleryH := &galleryhdl.Handler{}
	heroH := &herohdl.Handler{}

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
	mutate.PATCH("/content/:key", contentH.Save)
	mutate.POST("/content-images", contentH.UploadImage)
	mutate.POST("/gallery/:key/upload", galleryH.Upload)
	mutate.POST("/hero/:key/upload", heroH.Upload)
	mutate.POST("/gallery/images/:id/cover", galleryH.SetCover)
	mutate.POST("/gallery/images/:id/up", galleryH.MoveUp)
	mutate.POST("/gallery/images/:id/down", galleryH.MoveDown)
	mutate.POST("/gallery/images/:id/delete", galleryH.Delete)

	slog.Info("server starting", "port", cfg.Port, "pb", cfg.PBURL)
	if err := e.Start(":" + cfg.Port); err != nil && err != http.ErrServerClosed {
		slog.Error("server failed", "err", err)
		os.Exit(1)
	}
}
