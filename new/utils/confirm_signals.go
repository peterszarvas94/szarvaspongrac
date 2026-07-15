package utils

func ConfirmSignals(open bool, title, message, submitLabel, url, kind, formSelector string) map[string]any {
	return map[string]any{
		"confirm": map[string]any{
			"open":         open,
			"title":        title,
			"message":      message,
			"submitLabel":  submitLabel,
			"url":          url,
			"kind":         kind,
			"formSelector": formSelector,
		},
	}
}

func CloseConfirmSignals() map[string]any {
	return ConfirmSignals(false, "", "", "Rendben", "", "", "")
}
