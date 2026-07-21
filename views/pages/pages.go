package pages

type PageData struct {
	Title            string
	Description      string
	Authed           bool
	Email            string
	Canonical        string
	FooterBackHref   string
	FooterBackText   string
	FooterEmail      LinkView
	FooterPhone      LinkView
}

type HomeData struct {
	PageData
	HeroURL      string
	HeroFilename string
	ContentHTML  string
	ContentKey   string
	EditMode     bool
}

type HomeAdminData struct {
	ContentKey   string
	Authed       bool
	EditMode     bool
	HeroURL      string
	HeroFilename string
}

type ProseData struct {
	PageData
	PageTitle   string
	ContentKey  string
	ContentHTML string
	EditingKey  string
	EditorHTML  string
}

type GalleryAdminData struct {
	Key      string
	Authed   bool
	EditMode bool
}

type GalleryIndexData struct {
	PageData
	PageTitle string
	Cards     []GalleryCard
}

type GalleryCard struct {
	Href     string
	Title    string
	ImageAlt string
	CoverKey string
	CoverURL string
}

type GalleryData struct {
	PageData
	PageTitle string
	Key       string
	Images    []GalleryImage
	EditMode  bool
}

type GalleryImage struct {
	ID      string
	URL     string
	Cover   bool
	Sorting float64
}

type ContactData struct {
	PageData
	PageTitle string
	Email     LinkView
	Phone     LinkView
}

type LinkView struct {
	Key  string
	URL  string
	Text string
}

type AdminData struct {
	PageData
}
