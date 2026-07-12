package link

import (
	"context"
	"szarvaspongrac/pbclient"
)

const collection = "link"

type Link struct {
	Key  string
	URL  string
	Text string
}

func GetByKey(ctx context.Context, client *pbclient.Client, key string) (Link, error) {
	record, err := client.GetFirstRecord(collection, pbclient.FilterKey(key))
	if err != nil {
		return Link{Key: key}, nil
	}
	return Link{
		Key:  key,
		URL:  pbclient.RecordString(record, "url"),
		Text: pbclient.RecordString(record, "text"),
	}, nil
}

func Save(ctx context.Context, client *pbclient.Client, key, url, text string) error {
	records, err := client.ListRecords(collection, pbclient.FilterKey(key), "")
	if err != nil {
		return err
	}
	if len(records) > 0 {
		id := pbclient.RecordString(records[0], "id")
		_, err = client.UpdateRecord(collection, id, map[string]any{"url": url, "text": text})
		return err
	}
	_, err = client.CreateRecord(collection, map[string]string{"key": key, "url": url, "text": text}, nil)
	return err
}
