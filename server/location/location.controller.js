const httpStatus = require("http-status");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const request = require("request");

const { Location, LocationTemplate } = require("./location.model");

function _save(info, res, next) {
  const location = new Location({ ...LocationTemplate, ...info });

  location
    .save()
    .then((savedLocation) => res.json(savedLocation))
    .catch((err) => next(err));
}

function load(req, res, next, id) {
  return Location.get(id)
    .then((location) => {
      req.location = location;
      return next();
    })
    .catch((e) => next(e));
}

function get(req, res) {
  return res.json(req.location);
}

function create(req, res, next) {
  _save(req.body, res, next);
}

function update(req, res, next) {
  const location = { ...req.location, ...req.body };
  location
    .save()
    .then((savedLocation) => res.json(savedLocation))
    .catch((err) => next(err));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Location.list({ limit, skip })
    .then((locations) => res.json(locations))
    .catch((e) => next(e));
}

function remove(req, res, next) {
  const location = req.location;
  location
    .remove()
    .then((deletedLocation) => res.json(deletedLocation))
    .catch((e) => next(e));
}

function getPath(req, res, next) {
  console.log(req.query);

  // request(
  //   "http://api.map.baidu.com/directionlite/v1/walking?origin=40.01116,116.339303&destination=39.936404,116.452562&ak=6PKxc9MtxMDD5boyiB0zhH9SEMQIeuYk",
  //   { json: true },
  //   (err, _res, body) => {
  //     if (_res.statusCode == 200) {
  //       const routes = body.result.routes;

  //       const points = [];
  //       routes.forEach((d) =>
  //         d.steps.forEach((ste) =>
  //           ste.path.split(";").forEach((one) => {
  //             points.push(one.split(","));
  //           })
  //         )
  //       );
  //     }
  //   }
  // );
}

function uploadImg(req, res, next) {
  const form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.uploadDir = path.join(__dirname + "/../../public/img");
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;
  //处理图片
  form.parse(req, function (err, fields, files) {
    console.log(fields);
    console.log(files);
    let filename = files.file.name;
    let nameArray = filename.split(".");
    let type = nameArray[nameArray.length - 1];
    let name = "";
    for (let i = 0; i < nameArray.length - 1; i++) {
      name = name + nameArray[i];
    }
    let date = new Date();
    let time =
      "_" +
      date.getFullYear() +
      "_" +
      date.getMonth() +
      "_" +
      date.getDay() +
      "_" +
      date.getHours() +
      "_" +
      date.getMinutes();
    let avatarName = name + time + "." + type;
    let newPath = form.uploadDir + "/" + avatarName;
    fs.renameSync(files.file.path, newPath); //重命名
    _save(
      {
        ...fields,
        imgs: [{ name: avatarName, path: "/static/img/" + avatarName }],
      },
      res,
      next
    );
    // res.send({data:"/static/img/"+avatarName})
    // res.send('ok!');
  });
}

module.exports = { create, get, load, list, update, remove, uploadImg };
