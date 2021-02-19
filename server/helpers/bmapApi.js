const request = require("request");

ak = "6PKxc9MtxMDD5boyiB0zhH9SEMQIeuYk";
// getCoordinates("图书馆").then((d) => console.log(d));
function getCoordinates(
  query,
  leftBottom = "41.92737666057108,123.40344381957739",
  rightTop = "41.93584226552963,123.4186611149164"
) {
  let url = `http://api.map.baidu.com/place/v2/search?query=${query}&bounds=${leftBottom},${rightTop}&output=json&ak=${ak}`;
  url = encodeURI(url);

  return new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (res.statusCode == 200) {
        resolve(body.results);
      }
    });
  });
}

function getPaths(
  origin = "40.01116,116.339303",
  destination = "39.936404,116.452562"
) {
  let url = `http://api.map.baidu.com/directionlite/v1/walking?origin=${origin}&destination=${destination}&ak=${ak}`;
  url = encodeURI(url);

  return new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (res.statusCode == 200) {
        const routes = body.result.routes;

        const points = [];
        routes.forEach((d) =>
          d.steps.forEach((ste) =>
            ste.path.split(";").forEach((one) => {
              points.push(one.split(","));
            })
          )
        );

        resolve(points);
      }
    });
  });
}
