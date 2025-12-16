/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_449060851");

    // update collection data
    unmarshal(
      {
        name: "link",
      },
      collection,
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_449060851");

    // update collection data
    unmarshal(
      {
        name: "links",
      },
      collection,
    );

    return app.save(collection);
  },
);
