import { PrismaClient } from "@prisma/client";
import * as express from "express";
import * as cookieParser from "cookie-parser";

import weeksGetHandler from "@/routes/weeks/get";
import loginPostHandler from "@/routes/login/post";
import authMiddleware from "./middleware/auth";

const prisma = new PrismaClient();

async function main() {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  app.use((_, res, next) => {
    res.locals["prisma"] = prisma;
    next();
  });
  app.use(authMiddleware);

  app.get("/api/weeks", weeksGetHandler);

  app.post("/api/login", loginPostHandler);

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
