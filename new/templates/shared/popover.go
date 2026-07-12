package shared

import "szarvaspongrac/utils"

const PopoverOpenIDSignal = "popoverOpenId"

func OpenPopoverOnClick(id string) string {
	return "$" + PopoverOpenIDSignal + " = " + utils.JSONString(id)
}

func ClosePopoverOnClick() string {
	return "$" + PopoverOpenIDSignal + " = ''"
}

func PopoverOpenEffectExpr(id string) string {
	return "$" + PopoverOpenIDSignal + " === " + utils.JSONString(id) +
		" ? (!el.open && el.showModal()) : (el.open && el.close())"
}
