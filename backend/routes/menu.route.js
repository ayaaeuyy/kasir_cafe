/** load library express */
const express = require(`express`)
/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())
/** load menu's controller */
const menuController = require(`../controllers/menu.controller`)
const upload = require(`../controllers/upload-gambar`)
/** create route to get data with method "GET" */
app.get("/", menuController.getAllMenu)
/** create route to find menu
* using method "POST" and path "find" */
app.post("/find", menuController.findMenu)

app.post("/", [upload.single(`gambar`)], menuController.addMenu)
/** create route to update menu
* using method "PUT"
* and define parameter for "id" */
app.put("/:id", menuController.updateMenu)
/** create route to delete menu
* using method "DELETE" and define parameter for "id" */
app.delete("/:id", menuController.deleteMenu)
/** export app in order to load in another file */
module.exports = app




