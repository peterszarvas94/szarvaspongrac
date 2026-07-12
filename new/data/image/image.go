package image

import (
	"context"
	"fmt"
	"sort"
	"strings"

	"szarvaspongrac/pbclient"
)

const collection = "image"

type Image struct {
	ID       string
	Key      string
	URL      string
	Filename string
	Cover    bool
	Sorting  float64
}

func ListByKey(ctx context.Context, client *pbclient.Client, key string) ([]Image, error) {
	records, err := client.ListRecords(collection, pbclient.FilterKey(key), "sorting")
	if err != nil {
		return nil, err
	}
	images := make([]Image, 0, len(records))
	for _, record := range records {
		images = append(images, fromRecord(client, record))
	}
	sort.Slice(images, func(i, j int) bool { return images[i].Sorting < images[j].Sorting })
	return images, nil
}

func GetFirstURL(ctx context.Context, client *pbclient.Client, key string) (string, error) {
	images, err := ListByKey(ctx, client, key)
	if err != nil {
		return "", err
	}
	if len(images) == 0 {
		return "", nil
	}
	return images[0].URL, nil
}

func DeleteByKey(ctx context.Context, client *pbclient.Client, key string) error {
	records, err := client.ListRecords(collection, pbclient.FilterKey(key), "")
	if err != nil {
		return err
	}
	for _, record := range records {
		if err := client.DeleteRecord(collection, pbclient.RecordString(record, "id")); err != nil {
			return err
		}
	}
	return nil
}

func ReplaceByKey(ctx context.Context, client *pbclient.Client, key, filename string, data []byte) (Image, error) {
	if err := DeleteByKey(ctx, client, key); err != nil {
		return Image{}, err
	}
	record, err := client.CreateRecord(collection, map[string]string{
		"key":     key,
		"sorting": "0",
	}, map[string]pbclient.FileUpload{
		"file": {Filename: filename, Data: data},
	})
	if err != nil {
		return Image{}, err
	}
	return fromRecord(client, record), nil
}

func GetCoverURL(ctx context.Context, client *pbclient.Client, key string) (string, error) {
	filter := pbclient.FilterKey(key) + " && cover=true"
	record, err := client.GetFirstRecord(collection, filter)
	if err != nil {
		return "", err
	}
	return client.FileURL(record), nil
}

func Upload(ctx context.Context, client *pbclient.Client, key, filename string, data []byte) (Image, error) {
	records, err := client.ListRecords(collection, pbclient.FilterKey(key), "-sorting")
	maxSort := 0.0
	if err == nil && len(records) > 0 {
		maxSort = pbclient.RecordFloat(records[0], "sorting") + 1
	}
	record, err := client.CreateRecord(collection, map[string]string{
		"key":     key,
		"sorting": fmtFloat(maxSort),
	}, map[string]pbclient.FileUpload{
		"file": {Filename: filename, Data: data},
	})
	if err != nil {
		return Image{}, err
	}
	return fromRecord(client, record), nil
}

func Delete(ctx context.Context, client *pbclient.Client, id string) error {
	return client.DeleteRecord(collection, id)
}

func SetCover(ctx context.Context, client *pbclient.Client, id, key string) error {
	records, err := client.ListRecords(collection, pbclient.FilterKey(key)+" && cover=true", "")
	if err == nil {
		for _, record := range records {
			rid := pbclient.RecordString(record, "id")
			if rid != id {
				_, _ = client.UpdateRecord(collection, rid, map[string]any{"cover": false})
			}
		}
	}
	_, err = client.UpdateRecord(collection, id, map[string]any{"cover": true})
	return err
}

func SwapOrder(ctx context.Context, client *pbclient.Client, id1, id2 string) error {
	r1, err := client.GetFirstRecord(collection, `id="`+id1+`"`)
	if err != nil {
		return err
	}
	r2, err := client.GetFirstRecord(collection, `id="`+id2+`"`)
	if err != nil {
		return err
	}
	s1 := pbclient.RecordFloat(r1, "sorting")
	s2 := pbclient.RecordFloat(r2, "sorting")
	_, err = client.UpdateRecord(collection, id1, map[string]any{"sorting": s2})
	if err != nil {
		return err
	}
	_, err = client.UpdateRecord(collection, id2, map[string]any{"sorting": s1})
	return err
}

func fromRecord(client *pbclient.Client, record pbclient.Record) Image {
	return Image{
		ID:       pbclient.RecordString(record, "id"),
		Key:      pbclient.RecordString(record, "key"),
		URL:      client.FileURL(record),
		Filename: pbclient.RecordString(record, "file"),
		Cover:    pbclient.RecordBool(record, "cover"),
		Sorting:  pbclient.RecordFloat(record, "sorting"),
	}
}

func fmtFloat(v float64) string {
	return strings.TrimRight(strings.TrimRight(fmt.Sprintf("%.1f", v), "0"), ".")
}
