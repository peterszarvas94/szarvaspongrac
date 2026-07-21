package utils

import (
	"regexp"

	"github.com/microcosm-cc/bluemonday"
)

var contentPolicy = func() *bluemonday.Policy {
	p := bluemonday.UGCPolicy()
	p.AllowElements("figure")
	p.AllowAttrs("style").Matching(regexp.MustCompile(`(?i)^text-align:\s*(left|right|center|justify)\s*;?\s*$`)).OnElements("figure", "p", "h1", "h2", "h3")
	p.AllowAttrs("width").Matching(regexp.MustCompile(`^\d+$`)).OnElements("img")
	return p
}()

func SanitizeHTML(html string) string {
	return contentPolicy.Sanitize(html)
}
