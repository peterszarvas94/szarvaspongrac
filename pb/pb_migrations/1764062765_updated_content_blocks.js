/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2167443523")

  // update collection data
  unmarshal({
    "name": "content"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2167443523")

  // update collection data
  unmarshal({
    "name": "content_blocks"
  }, collection)

  return app.save(collection)
})
