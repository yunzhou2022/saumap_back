const express = require("express");
const { route } = require("../../index.route");
const locationCtrl = require("./location.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/").get(locationCtrl.list).post(locationCtrl.create);

router.route("/paths").get(locationCtrl.getPaths);

router.route("/uploadImg").post(locationCtrl.uploadImg);

router.route("/getMp3").post(locationCtrl.getMp3);

router
  .route("/:locationId")
  .get(locationCtrl.get)
  .put(locationCtrl.update)
  .delete(locationCtrl.remove);

router.param("locationId", locationCtrl.load);
module.exports = router;
