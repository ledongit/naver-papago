const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const NAVER_ID = process.env.NAVER_ID;
const NAVER_SECRET = process.env.NAVER_SECRET;

// 환경변수에 설정된 port로 접근하거나 해당 포트가 없으면 8083으로 접근해라
app.set("port", process.env.PORT || 8083);
const port = app.get("port");
app.use(cors());
app.use(morgan("dev"));
// POST로 데이터를 받을 경우 express 모듈을 사용해야함..
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// morgan을 그대로 쓰면 많은 정보가 출력됨
// dev 로 간략하게 어떻게 접근하고 있는 지 정보를 알 수 있음

app.get("/", (req, res) => {
  res.send("hello express");
});

app.post("/papago", (req, res) => {
  console.log(req.body.txt);
  const txt = req.body.txt;
  const language = req.body.language;
  axios({
    url: "https://openapi.naver.com/v1/papago/n2mt",
    method: "POST",
    params: {
      source: "ko",
      target: language,
      text: txt,
    },
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((response) => {
      res.json({ result: response.data.message.result.translatedText });
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`${port}에서 서버 대기중`);
});
