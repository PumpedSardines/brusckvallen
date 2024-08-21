import { PrismaClient } from "@prisma/client";
import * as express from "express";
import * as cookieParser from "cookie-parser";

import resForger from "@/utils/resForge";

import authMiddleware from "@/middleware/auth";

import weeksGetHandler from "@/routes/weeks/get";
import weeksPutHandler from "@/routes/weeks/put";
import weeksDeleteHandler from "@/routes/weeks/delete";

import loginPostHandler from "@/routes/login/post";

const prisma = new PrismaClient();

async function main() {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  app.use((_, res, next) => {
    res.locals["prisma"] = prisma;
    next();
  });

  app.use((_, res, next) => {
    const forger = resForger(res);
    try {
      next();
    } catch (e) {
      return forger(500, { msg: "Something went wrong" });
    }
  });

  app.get("/api/weeks", weeksGetHandler);
  app.post("/api/login", loginPostHandler);

  app.use(authMiddleware);

  app.put("/api/weeks", weeksPutHandler);
  app.delete("/api/weeks", weeksDeleteHandler);

  app.use((_, res) => {
    const forger = resForger(res);

    return forger(404, { msg: "Not Found" });
  });

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
