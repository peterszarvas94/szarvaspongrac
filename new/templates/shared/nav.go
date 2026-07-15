package shared

type NavItem struct {
	Href  string
	Label string
}

func NavItems() []NavItem {
	return []NavItem{
		{Href: "/oneletrajz", Label: "Önéletrajz"},
		{Href: "/elismeresek", Label: "Elismerések"},
		{Href: "/konyvillusztraciok", Label: "Könyvillusztrációk"},
		{Href: "/galeria", Label: "Galéria"},
		{Href: "/kapcsolat", Label: "Kapcsolat"},
	}
}

func NavCardHoverClass(hoverColor string) string {
	switch hoverColor {
	case "primary":
		return "group-hover:bg-primary/20 group-hover:text-primary"
	case "secondary":
		return "group-hover:bg-secondary/20 group-hover:text-secondary"
	case "accent":
		return "group-hover:bg-accent/20 group-hover:text-accent"
	case "warning":
		return "group-hover:bg-warning/20 group-hover:text-warning"
	case "success":
		return "group-hover:bg-success/20 group-hover:text-success"
	default:
		return ""
	}
}
