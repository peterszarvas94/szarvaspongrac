package pages

import "github.com/a-h/templ"

func heroBgStyle(url string) templ.SafeCSS {
	if url == "" {
		return ""
	}
	return templ.SafeCSS("background-image: url(" + url + ")")
}

func heroOverlayClass(url string) string {
	if url == "" {
		return ""
	}
	return "before:absolute before:inset-0 before:bg-neutral/40 before:pointer-events-none"
}
