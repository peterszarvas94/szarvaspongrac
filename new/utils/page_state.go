package utils

type PageState struct {
	EditMode   bool   `json:"editMode"`
	EditingKey string `json:"editingKey"`
	EditorHTML string `json:"editorHtml"`
}

func DefaultPageState() PageState {
	return PageState{}
}

func GetPageState(tabID string) PageState {
	return TabStateGetOrInit(tabID, DefaultPageState)
}

func SetPageState(tabID string, state PageState) {
	TabStateSet(tabID, state)
}

func PageSignals(state PageState, tabID string) map[string]any {
	return map[string]any{
		"editMode":      state.EditMode,
		"editingKey":    state.EditingKey,
		"editorHtml":    state.EditorHTML,
		"bold":          false,
		"italic":        false,
		"underline":     false,
		"strike":        false,
		"paragraph":     true,
		"heading1":      false,
		"heading2":      false,
		"heading3":      false,
		"bulletList":    false,
		"orderedList":   false,
		"blockquote":    false,
		"codeBlock":     false,
		"tab_id":        tabID,
		"popoverOpenId": "",
	}
}
