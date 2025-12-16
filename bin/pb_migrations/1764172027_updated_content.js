/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2167443523");

    // remove field
    collection.fields.removeById("text2324736937");

    // update field
    collection.fields.addAt(
      1,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text336246304",
        max: 0,
        min: 0,
        name: "key",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2167443523");

    // add field
    collection.fields.addAt(
      2,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text2324736937",
        max: 100,
        min: 0,
        name: "name",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      }),
    );

    // update field
    collection.fields.addAt(
      1,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text336246304",
        max: 0,
        min: 0,
        name: "category",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: "text",
      }),
    );

    return app.save(collection);
  },
);
