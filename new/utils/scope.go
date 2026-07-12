package utils

import (
	"context"
	"szarvaspongrac/pbclient"
)

type scopeKey struct{}

type Scope struct {
	Authed   bool
	Email    string
	PBClient *pbclient.Client
}

func WithScope(ctx context.Context, scope Scope) context.Context {
	return context.WithValue(ctx, scopeKey{}, scope)
}

func GetScope(ctx context.Context) Scope {
	scope, _ := ctx.Value(scopeKey{}).(Scope)
	return scope
}
