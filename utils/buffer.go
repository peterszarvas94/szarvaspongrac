package utils

func ContentKeyID(key string) string {
	out := make([]byte, 0, len(key))
	for i := 0; i < len(key); i++ {
		if key[i] == '.' {
			out = append(out, '-')
		} else {
			out = append(out, key[i])
		}
	}
	return string(out)
}
