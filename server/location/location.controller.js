const httpStatus = require("http-status");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bmapApi = require("../helpers/bmapApi");

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

async function getPaths(req, res, next) {
  console.log("getPaths");
  console.log(req.query);

  const { from: origin, to, type } = req.query;
  let destination = to;
  if (type == "poi") {
    try {
      const info = await bmapApi.getCoordinates(to);
      if (info.length == 0) {
        res.json([]);
        return;
      }
      const location = info[0].location;
      destination = `${location?.lat},${location?.lng}`;
    } catch (error) {
      res.json([]);
      return;
    }
  }

  const paths = await bmapApi.getPaths(origin, destination);
  res.json(paths);
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

module.exports = {
  create,
  get,
  load,
  list,
  update,
  remove,
  uploadImg,
  getPaths,
};
