package pages

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"szarvaspongrac/data/content"
	"szarvaspongrac/data/image"
	"szarvaspongrac/data/link"
	"szarvaspongrac/templates/pages"
	"szarvaspongrac/utils"
	view "szarvaspongrac/views/pages"
)

type Handler struct {
	Config utils.Config
}

func (h *Handler) base(c echo.Context) view.PageData {
	scope := utils.GetScope(c.Request().Context())
	email, _ := link.GetByKey(c.Request().Context(), scope.PBClient, "contact.email")
	phone, _ := link.GetByKey(c.Request().Context(), scope.PBClient, "contact.phone")
	return view.PageData{
		Authed:    scope.Authed,
		Email:     scope.Email,
		Canonical: h.Config.PublicURL + c.Request().URL.Path,
		FooterEmail: view.LinkView{Key: email.Key, URL: email.URL, Text: email.Text},
		FooterPhone: view.LinkView{Key: phone.Key, URL: phone.URL, Text: phone.Text},
	}
}

func (h *Handler) page(c echo.Context, title, description string) view.PageData {
	base := h.base(c)
	base.Title = title
	base.Description = description
	return base
}

func (h *Handler) Home(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	tabID := utils.EnsureTabID(c)
	pageState := utils.GetPageState(tabID)
	heroURL, _ := image.GetFirstURL(c.Request().Context(), scope.PBClient, "home.home")
	html, _ := content.GetByKey(c.Request().Context(), scope.PBClient, "home.home")
	data := view.HomeData{
		PageData:    h.page(c, "Szarvas Pongrác - Grafikus, Illusztrátor, Festő", "Szarvas Pongrác grafikus, festő, illusztrátor honlapja"),
		HeroURL:     heroURL,
		ContentHTML: html,
		ContentKey:  "home.home",
		EditMode:    pageState.EditMode,
	}
	return utils.RenderPage(c, pages.Home(data))
}

func (h *Handler) Prose(c echo.Context, key, title, description, pageTitle string) error {
	scope := utils.GetScope(c.Request().Context())
	tabID := utils.EnsureTabID(c)
	pageState := utils.GetPageState(tabID)
	html, _ := content.GetByKey(c.Request().Context(), scope.PBClient, key)
	data := view.ProseData{
		PageData:    h.page(c, title, description),
		PageTitle:   pageTitle,
		ContentKey:  key,
		ContentHTML: html,
		EditingKey:  pageState.EditingKey,
		EditorHTML:  pageState.EditorHTML,
	}
	return utils.RenderPage(c, pages.Prose(data))
}

func (h *Handler) Oneletrajz(c echo.Context) error {
	return h.Prose(c, "cv.cv", "Önéletrajz - Szarvas Pongrác", "Szarvas Pongrác önéletrajz és művészeti pályafutása", "Önéletrajz")
}

func (h *Handler) Elismeresek(c echo.Context) error {
	return h.Prose(c, "cv.awards", "Elismerések - Szarvas Pongrác", "Szarvas Pongrác elismerései", "Elismerések")
}

func (h *Handler) Konyvillusztraciok(c echo.Context) error {
	return h.Prose(c, "cv.books", "Könyvillusztrációk - Szarvas Pongrác", "Szarvas Pongrác könyvillusztrációi", "Könyvillusztrációk és egyéb kiadványok")
}

func (h *Handler) Contact(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	email, _ := link.GetByKey(c.Request().Context(), scope.PBClient, "contact.email")
	phone, _ := link.GetByKey(c.Request().Context(), scope.PBClient, "contact.phone")
	pd := h.page(c, "Kapcsolat - Szarvas Pongrác", "Vegye fel a kapcsolatot Szarvas Pongrác grafikus, festő, illusztrátor művésszel")
	data := view.ContactData{
		PageData:  pd,
		PageTitle: "Kapcsolat",
		Email:       view.LinkView{Key: email.Key, URL: email.URL, Text: email.Text},
		Phone:       view.LinkView{Key: phone.Key, URL: phone.URL, Text: phone.Text},
	}
	return utils.RenderPage(c, pages.Contact(data))
}

func (h *Handler) GalleryIndex(c echo.Context) error {
	scope := utils.GetScope(c.Request().Context())
	cards := []view.GalleryCard{
		{Href: "/galeria/olaj", CoverKey: "gallery.oil", ImageAlt: "Olajfestmények", Title: "Olajfestmények"},
		{Href: "/galeria/akvarell", CoverKey: "gallery.watercolor", ImageAlt: "Akvarellek", Title: "Akvarellek"},
		{Href: "/galeria/pasztell", CoverKey: "gallery.pastel", ImageAlt: "Pasztellek", Title: "Pasztellek"},
		{Href: "/galeria/grafika", CoverKey: "gallery.graphics", ImageAlt: "Grafikák", Title: "Grafikák"},
		{Href: "/galeria/illusztracio", CoverKey: "gallery.illustration", ImageAlt: "Illusztrációk", Title: "Illusztrációk"},
		{Href: "/galeria/egyeb", CoverKey: "gallery.others", ImageAlt: "Egyéb alkotások", Title: "Egyéb alkotások"},
	}
	for i := range cards {
		url, _ := image.GetCoverURL(c.Request().Context(), scope.PBClient, cards[i].CoverKey)
		cards[i].CoverURL = url
	}
	data := view.GalleryIndexData{
		PageData:  h.page(c, "Galéria - Szarvas Pongrác", "Szarvas Pongrác képgalériája"),
		PageTitle: "Galéria",
		Cards:       cards,
	}
	return utils.RenderPage(c, pages.GalleryIndex(data))
}

var galleryRoutes = map[string]struct{ title, desc, pageTitle, key string }{
	"olaj":          {"Olajfestmények - Szarvas Pongrác", "Szarvas Pongrác olajfestményei", "Olajfestmények", "gallery.oil"},
	"akvarell":      {"Akvarellek - Szarvas Pongrác", "Szarvas Pongrác akvarelljeinek gyűjteménye", "Akvarellek", "gallery.watercolor"},
	"pasztell":      {"Pasztellek - Szarvas Pongrác", "Szarvas Pongrác pasztelljei", "Pasztellek", "gallery.pastel"},
	"grafika":       {"Grafikák - Szarvas Pongrác", "Szarvas Pongrác grafikái", "Grafikák", "gallery.graphics"},
	"illusztracio":  {"Illusztrációk - Szarvas Pongrác", "Szarvas Pongrác illusztrációi", "Illusztrációk", "gallery.illustration"},
	"egyeb":         {"Egyéb alkotások - Szarvas Pongrác", "Szarvas Pongrác egyéb alkotásai", "Egyéb alkotások", "gallery.others"},
}

func (h *Handler) Gallery(c echo.Context) error {
	slug := c.Param("slug")
	meta, ok := galleryRoutes[slug]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound)
	}
	scope := utils.GetScope(c.Request().Context())
	tabID := utils.EnsureTabID(c)
	pageState := utils.GetPageState(tabID)
	images, _ := image.ListByKey(c.Request().Context(), scope.PBClient, meta.key)
	views := make([]view.GalleryImage, 0, len(images))
	for _, img := range images {
		views = append(views, view.GalleryImage{ID: img.ID, URL: img.URL, Cover: img.Cover, Sorting: img.Sorting})
	}
	pd := h.page(c, meta.title, meta.desc)
	pd.FooterBackHref = "/galeria"
	pd.FooterBackText = "Vissza a Galériákhoz"
	data := view.GalleryData{
		PageData:  pd,
		PageTitle: meta.pageTitle,
		Key:         meta.key,
		Images:      views,
		EditMode:    pageState.EditMode,
	}
	return utils.RenderPage(c, pages.Gallery(data))
}
