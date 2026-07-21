package utils

import "sync"

type tabStateStore struct {
	mu   sync.RWMutex
	data map[string]any
}

var TabStateStore = &tabStateStore{data: map[string]any{}}

func TabStateGet[T any](s *tabStateStore, tabID string) (T, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	v, ok := s.data[tabID]
	if !ok {
		var zero T
		return zero, false
	}

	typed, ok := v.(T)
	if !ok {
		var zero T
		return zero, false
	}

	return typed, true
}

func TabStateGetOrInit[T any](tabID string, init func() T) T {
	if st, ok := TabStateGet[T](TabStateStore, tabID); ok {
		return st
	}
	st := init()
	TabStateSet(tabID, st)
	return st
}

func TabStateSet[T any](tabID string, state T) {
	TabStateStore.mu.Lock()
	defer TabStateStore.mu.Unlock()
	TabStateStore.data[tabID] = state
}

func (s *tabStateStore) Delete(tabID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.data, tabID)
}
