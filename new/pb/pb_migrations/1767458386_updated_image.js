/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_242989748")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool2366146245",
    "name": "cover",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_242989748")

  // remove field
  collection.fields.removeById("bool2366146245")

  return app.save(collection)
})
