package utils

import "github.com/microcosm-cc/bluemonday"

var contentPolicy = bluemonday.UGCPolicy()

func SanitizeHTML(html string) string {
	return contentPolicy.Sanitize(html)
}
