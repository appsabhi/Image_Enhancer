const controller = require("../Controller/enhance_controller");
const express = require("express");
const route = express.Router();
const upload = require("../util/multer");

route.get("/", controller.get_home);
route.post(
  "/image_enhance",
  upload.single("image"),
  controller.upload_and_enhance_image
);

module.exports = route;
