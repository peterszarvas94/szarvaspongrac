package pages

type PageData struct {
	Title            string
	Description      string
	Authed           bool
	Email            string
	Canonical        string
	FooterBackHref   string
	FooterBackText   string
}

type HomeData struct {
	PageData
	HeroURL     string
	ContentHTML string
	ContentKey  string
}

type ProseData struct {
	PageData
	PageTitle   string
	ContentKey  string
	ContentHTML string
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
