package pbclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Client struct {
	baseURL    string
	token      string
	httpClient *http.Client
}

type Record map[string]any

type FileUpload struct {
	Filename string
	Data     []byte
}

type listResponse struct {
	Items []Record `json:"items"`
}

type authResponse struct {
	Token  string `json:"token"`
	Record Record `json:"record"`
}

func New(baseURL string) *Client {
	return &Client{baseURL: strings.TrimRight(baseURL, "/"), httpClient: &http.Client{Timeout: 30 * time.Second}}
}

func (c *Client) WithToken(token string) *Client {
	clone := *c
	clone.token = token
	return &clone
}

func (c *Client) AuthWithPassword(email, password string) (string, Record, error) {
	body, _ := json.Marshal(map[string]string{"identity": email, "password": password})
	req, _ := http.NewRequest(http.MethodPost, c.baseURL+"/api/collections/_superusers/auth-with-password", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", nil, fmt.Errorf("auth failed: %s", readError(resp))
	}
	var result authResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", nil, err
	}
	return result.Token, result.Record, nil
}

func (c *Client) ListRecords(collection, filter, sort string) ([]Record, error) {
	q := url.Values{}
	if filter != "" {
		q.Set("filter", filter)
	}
	if sort != "" {
		q.Set("sort", sort)
	}
	q.Set("perPage", "500")
	endpoint := fmt.Sprintf("%s/api/collections/%s/records?%s", c.baseURL, collection, q.Encode())
	req, _ := http.NewRequest(http.MethodGet, endpoint, nil)
	c.setAuth(req)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("list failed: %s", readError(resp))
	}
	var result listResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Items, nil
}

func (c *Client) GetFirstRecord(collection, filter string) (Record, error) {
	items, err := c.ListRecords(collection, filter, "")
	if err != nil {
		return nil, err
	}
	if len(items) == 0 {
		return nil, fmt.Errorf("record not found")
	}
	return items[0], nil
}

func (c *Client) CreateRecord(collection string, fields map[string]string, files map[string]FileUpload) (Record, error) {
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	for key, value := range fields {
		_ = writer.WriteField(key, value)
	}
	for fieldName, file := range files {
		part, _ := writer.CreateFormFile(fieldName, file.Filename)
		_, _ = part.Write(file.Data)
	}
	_ = writer.Close()
	req, _ := http.NewRequest(http.MethodPost, fmt.Sprintf("%s/api/collections/%s/records", c.baseURL, collection), &body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	c.setAuth(req)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("create failed: %s", readError(resp))
	}
	var record Record
	if err := json.NewDecoder(resp.Body).Decode(&record); err != nil {
		return nil, err
	}
	return record, nil
}

func (c *Client) UpdateRecord(collection, id string, fields map[string]any) (Record, error) {
	body, _ := json.Marshal(fields)
	req, _ := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/api/collections/%s/records/%s", c.baseURL, collection, id), bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	c.setAuth(req)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("update failed: %s", readError(resp))
	}
	var record Record
	if err := json.NewDecoder(resp.Body).Decode(&record); err != nil {
		return nil, err
	}
	return record, nil
}

func (c *Client) DeleteRecord(collection, id string) error {
	req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("%s/api/collections/%s/records/%s", c.baseURL, collection, id), nil)
	c.setAuth(req)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("delete failed: %s", readError(resp))
	}
	return nil
}

func (c *Client) ProxyFile(w http.ResponseWriter, r *http.Request, path string) {
	target := c.baseURL + path
	if r.URL.RawQuery != "" {
		target += "?" + r.URL.RawQuery
	}
	req, _ := http.NewRequestWithContext(r.Context(), http.MethodGet, target, nil)
	c.setAuth(req)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		http.Error(w, "proxy error", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()
	for key, values := range resp.Header {
		for _, v := range values {
			w.Header().Add(key, v)
		}
	}
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)
}

func (c *Client) setAuth(req *http.Request) {
	if c.token != "" {
		req.Header.Set("Authorization", c.token)
	}
}

func (c *Client) FileURL(record Record) string {
	collectionID, _ := record["collectionId"].(string)
	id, _ := record["id"].(string)
	filename, _ := record["file"].(string)
	if collectionID == "" || id == "" || filename == "" {
		return ""
	}
	return fmt.Sprintf("/api/files/%s/%s/%s", collectionID, id, filename)
}

func RecordString(record Record, key string) string {
	v, _ := record[key].(string)
	return v
}

func RecordBool(record Record, key string) bool {
	v, _ := record[key].(bool)
	return v
}

func RecordFloat(record Record, key string) float64 {
	switch v := record[key].(type) {
	case float64:
		return v
	case int:
		return float64(v)
	default:
		return 0
	}
}

func FilterKey(key string) string {
	return fmt.Sprintf(`key="%s"`, key)
}

func readError(resp *http.Response) string {
	body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
	return fmt.Sprintf("%d %s", resp.StatusCode, string(body))
}
