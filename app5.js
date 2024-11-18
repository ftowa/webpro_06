const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // POSTデータ解析
app.use("/public", express.static(__dirname + "/public"));

// ======= じゃんけん機能 =======
app.get("/janken", (req, res) => {
  res.render("janken_form");
});

app.post("/janken", (req, res) => {
  const hand = req.body.hand; // 人間の手
  let win = Number(req.body.win || 0); // 勝利数
  let total = Number(req.body.total || 0); // 試合数

  const num = Math.floor(Math.random() * 3 + 1); // CPUの手のランダム生成
  let cpu = ''; // CPUの手
  if (num === 1) cpu = "グー";
  else if (num === 2) cpu = "チョキ";
  else cpu = "パー";

  // 勝敗判定
  let judgement = "";
  if (hand === cpu) {
    judgement = "引き分け";
  } else if (
    (hand === "グー" && cpu === "チョキ") ||
    (hand === "チョキ" && cpu === "パー") ||
    (hand === "パー" && cpu === "グー")
  ) {
    judgement = "勝ち";
    win += 1; // 勝利数を増加
  } else {
    judgement = "負け";
  }

  total += 1; // 試合数を増加

  res.render("janken_result", { hand, cpu, judgement, win, total });
});

// ======= 数当てゲーム =======
app.get("/guess", (req, res) => {
  res.render("guess_form", { win: 0, attempts: 0 });
});

app.post("/guess", (req, res) => {
  const userNumber = Number(req.body.number);
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  let message = "";
  let win = Number(req.body.win || 0);
  let attempts = Number(req.body.attempts || 0);

  attempts++;
  if (userNumber === randomNumber) {
    message = "正解！";
    win++;
  } else {
    message = `不正解！答えは ${randomNumber} でした。`;
  }

  res.render("guess_result", { userNumber, randomNumber, message, win, attempts });
});

// ======= 反射神経ゲーム =======
app.get("/reaction", (req, res) => {
  res.render("reaction_start");
});

app.post("/reaction", (req, res) => {
  const reactionTime = Number(req.body.reactionTime);
  res.render("reaction_result", { reactionTime });
});

// サーバー起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
