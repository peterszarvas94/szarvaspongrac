package assets

import (
	"encoding/json"
	"io/fs"
	"strings"
	"sync"
)

const (
	manifestPath  = "gen/manifest.json"
	importMapPath = "gen/importmap.json"
	importMapSrc  = "importmap.json"
)

var (
	loadOnce   sync.Once
	assetPaths map[string]string
	importMap  string
	staticFS   fs.FS
)

func Init(f fs.FS) {
	staticFS = f
}

func AssetPath(logical string) string {
	load()
	normalized := strings.TrimPrefix(logical, "/")
	if url, ok := assetPaths[normalized]; ok {
		return url
	}
	return "/static/" + normalized
}

func ImportMapJSON() string {
	load()
	if importMap == "" {
		return `{"imports":{}}`
	}
	return importMap
}

func load() {
	loadOnce.Do(func() {
		assetPaths = map[string]string{}

		if staticFS == nil {
			return
		}

		manifestContent, err := fs.ReadFile(staticFS, manifestPath)
		if err == nil {
			_ = json.Unmarshal(manifestContent, &assetPaths)
		}

		importMapContent, err := fs.ReadFile(staticFS, importMapPath)
		if err == nil && json.Valid(importMapContent) {
			importMap = string(importMapContent)
			return
		}

		sourceImportMap, sourceErr := fs.ReadFile(staticFS, importMapSrc)
		if sourceErr == nil && json.Valid(sourceImportMap) {
			importMap = string(sourceImportMap)
		}
	})
}
