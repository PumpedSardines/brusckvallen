import { PrismaClient } from "@prisma/client";
import * as express from "express";

async function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const prisma = res.locals["prisma"] as PrismaClient;
  const token = req.cookies["token"] as string | undefined;

  if (token == null) {
    next();
    return;
  }

  const user = await prisma.userSession.findUnique({
    where: {
      token,
    },
    select: {
      user: true,
    },
  });

  if (user != null) {
    res.locals["user"] = user.user;
  }

  next();
}

export default authMiddleware;
