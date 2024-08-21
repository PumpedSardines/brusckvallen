import * as express from "express";

const app = express();

app.get("/api/weeks", (_, res) => {
  const weeksData = new Map<
    `${number}:${number}`,
    { price: number; booked: boolean }
  >();
  for (let i = 36; i < 52; i++) {
    const prices = [11000, 14000, 17000, 20000];

    weeksData.set(`${i}:2024`, {
      price: prices[~~(Math.random() * 4)]!,
      booked: Math.random() < 0.5,
    });
  }
  for (let i = 1; i < 10; i++) {
    const random = ~~(Math.random() * 22 - 6);
    if (random + 36 === 40) {
      continue;
    }
    weeksData.delete(`${36 + random}:2024`);
  }

  weeksData.delete("36:2024");
  weeksData.delete("37:2024");
  weeksData.delete("38:2024");
  weeksData.delete("39:2024");

  const data = Object.fromEntries(weeksData.entries());

  res.send(data);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
