package shared

func GalleryCoverBtnClass(isCover bool) string {
	if isCover {
		return "btn-primary"
	}
	return ""
}

func GalleryCoverTitle(isCover bool) string {
	if isCover {
		return "Jelenlegi borítókép"
	}
	return "Borítóképnek jelölés"
}
