package content

import (
	"context"
	"fmt"
	"szarvaspongrac/pbclient"
)

const collection = "content"

func GetByKey(ctx context.Context, client *pbclient.Client, key string) (string, error) {
	record, err := client.GetFirstRecord(collection, pbclient.FilterKey(key))
	if err != nil {
		return "", nil
	}
	return pbclient.RecordString(record, "value"), nil
}

func Save(ctx context.Context, client *pbclient.Client, key, value string) error {
	records, err := client.ListRecords(collection, pbclient.FilterKey(key), "")
	if err != nil {
		return err
	}
	if len(records) > 0 {
		id := pbclient.RecordString(records[0], "id")
		_, err = client.UpdateRecord(collection, id, map[string]any{"value": value})
		return err
	}
	_, err = client.CreateRecord(collection, map[string]string{"key": key, "value": value}, nil)
	return err
}

func GetIDByKey(ctx context.Context, client *pbclient.Client, key string) (string, error) {
	record, err := client.GetFirstRecord(collection, pbclient.FilterKey(key))
	if err != nil {
		return "", fmt.Errorf("not found")
	}
	return pbclient.RecordString(record, "id"), nil
}
