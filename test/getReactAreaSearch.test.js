const request = require("request");
const { get } = require("../server/location/location.controller");

function getCoordinates(
  query,
  leftBottom = "41.92737666057108,123.40344381957739",
  rightTop = "41.93584226552963,123.4186611149164"
) {
  let req = `http://api.map.baidu.com/place/v2/search?query=${query}&bounds=${leftBottom},${rightTop}&output=json&ak=6PKxc9MtxMDD5boyiB0zhH9SEMQIeuYk`;
  req = encodeURI(req);

  return new Promise((resolve, reject) => {
    request(req, { json: true }, (err, res, body) => {
      if (res.statusCode == 200) {
        resolve(body.results);
      }
    });
  });
}

async function getData() {
  const data = await getCoordinates("图书馆");
  console.log(data);
}

getData();
