package shared

import (
	"fmt"

	"szarvaspongrac/utils"
)

type ConfirmDialogProps struct {
	Title        string
	Message      string
	SubmitLabel  string
	URL          string
	Kind         string
	FormSelector string
}

func DefaultConfirmSignals() map[string]any {
	return map[string]any{
		"confirm": map[string]any{
			"open":         false,
			"title":        "",
			"message":      "",
			"submitLabel":  "Rendben",
			"url":          "",
			"kind":         "",
			"formSelector": "",
		},
	}
}

func OpenConfirmClickExpr(props ConfirmDialogProps) string {
	return fmt.Sprintf(
		`$confirm = {open: true, kind: %s, title: %s, message: %s, submitLabel: %s, url: %s, formSelector: %s}`,
		utils.JSONString(props.Kind),
		utils.JSONString(props.Title),
		utils.JSONString(props.Message),
		utils.JSONString(props.SubmitLabel),
		utils.JSONString(props.URL),
		utils.JSONString(props.FormSelector),
	)
}
