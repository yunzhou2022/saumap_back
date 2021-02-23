const request = require("request");
const path = require("path");
const fs = require("fs");
const utf8 = require("utf8");

function getToken() {
  const client_id = "7Py6GEvlHPzqjm29WbVopEQ1";
  const client_secret = "loE5xk20Qs4ey2e4kU10aMjT5zGukEQC";
  const url = `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`;

  return new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (!err) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
}

function downloadMp3(url, form) {
  const req = request({
    url: url,
    method: "POST",
    timeout: 10000,
    pool: false,
    form: form,
  });

  req.setMaxListeners(50);
  req.setHeader(
    "user-agent",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  );

  return new Promise((resolve, reject) => {
    req.on("error", function (err) {
      throw err;
    });
    req.on("response", function (res) {
      res.setEncoding("binary");
      let fileData = "";

      res.on("data", function (chunk) {
        fileData += chunk;
      });
      res.on("end", function () {
        let name = 11;
        const mp3Path = path.join(__dirname + `/../../public/bgm/${name}.mp3`);
        fs.writeFile(mp3Path, fileData, "binary", (err) => {
          if (err) {
            reject(err);
            // console.log(err);
          } else {
            resolve("/static/bgm/" + name + ".mp3");
            // console.log("/static/bgm/" + name + ".mp3");
          }
        });
      });
    });
  });
}

async function getMp3(text) {
  const { access_token } = await getToken();
  const url = "https://tsn.baidu.com/text2audio";
  // const url =
  //   "http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=24.ade4fb70155301bebf33a21f682896cf.2592000.1616463169.282335-23679331&tex=%E7%99%BE%E5%BA%A6%E4%BD%A0%E5%A5%BD&vol=9&per=4&spd=5&pit=5&aue=3";
  let tex = text.toString("utf8");
  tex = encodeURIComponent(text);
  const form = {
    tok: access_token,
    tex: tex,
    cuid: "xxx", //用户唯一标识，用来计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内
    ctp: 1, //客户端类型
    lan: "zh",
    per: 4, // 声音
    aue: 3, //返回类型
  };

  const res = await downloadMp3(url, form);
  return res;
}
module.exports = { getMp3 };
