package shared

type ProseEditData struct {
	ContentKey  string
	ContentHTML string
	EditingKey  string
	EditorHTML  string
	Authed      bool
}

func (d ProseEditData) IsEditing() bool {
	return d.EditingKey == d.ContentKey
}

func (d ProseEditData) InitialEditorContent() string {
	if d.EditorHTML != "" {
		return d.EditorHTML
	}
	return d.ContentHTML
}
